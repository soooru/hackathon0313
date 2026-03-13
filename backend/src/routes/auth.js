const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const { getDb } = require('../db/init');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// In-memory OTP store: email → { code, expiresAt }
const otpStore = new Map();

// POST /api/auth/send-code — presignup validation + send OTP via Resend
router.post('/send-code', async (req, res) => {
  try {
    const { email, nickname, password } = req.body;
    if (!email || !nickname || !password) {
      return res.status(400).json({ error: '이메일, 닉네임, 비밀번호를 모두 입력해주세요.' });
    }
    const domain = email.split('@')[1];
    if (!domain) return res.status(400).json({ error: '유효하지 않은 이메일 형식입니다.' });

    const db = getDb();
    const allowed = db.prepare('SELECT id FROM allowed_domains WHERE domain = ?').get(domain);
    if (!allowed) return res.status(403).json({ error: '사내 이메일 주소만 가입할 수 있습니다.' });

    if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: '비밀번호는 영문+숫자 조합 6자 이상이어야 합니다.' });
    }
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
      return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
    }
    if (db.prepare('SELECT id FROM users WHERE nickname = ?').get(nickname)) {
      return res.status(409).json({ error: '이미 사용 중인 닉네임입니다.' });
    }

    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(email, { code, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Send email via Resend (failure is non-fatal — B1234 backdoor handles it)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: '[출근장터] 이메일 인증 코드',
        html: `<p>안녕하세요! 출근장터 가입을 위한 인증 코드입니다.</p>
               <h2 style="letter-spacing:4px">${code}</h2>
               <p>5분 내에 입력해주세요.</p>`,
      });
    } catch (emailErr) {
      console.error('[send-code] 이메일 발송 실패:', emailErr.message);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /api/auth/verify-code — OTP verification (B1234 backdoor)
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: '이메일과 인증코드를 입력해주세요.' });
  }

  // Backdoor
  if (code === 'B1234') {
    return res.json({ ok: true });
  }

  const entry = otpStore.get(email);
  if (!entry) {
    return res.status(400).json({ error: '인증코드가 발송되지 않았거나 만료되었습니다.' });
  }
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: '인증코드가 만료되었습니다. 다시 시도해주세요.' });
  }
  if (entry.code !== code) {
    return res.status(400).json({ error: '인증코드가 올바르지 않습니다.' });
  }

  otpStore.delete(email);
  res.json({ ok: true });
});

// POST /api/auth/presignup — validation only, no account creation
router.post('/presignup', async (req, res) => {
  try {
    const { email, nickname, password } = req.body;
    if (!email || !nickname || !password) {
      return res.status(400).json({ error: '이메일, 닉네임, 비밀번호를 모두 입력해주세요.' });
    }
    const domain = email.split('@')[1];
    if (!domain) return res.status(400).json({ error: '유효하지 않은 이메일 형식입니다.' });

    const db = getDb();
    const allowed = db.prepare('SELECT id FROM allowed_domains WHERE domain = ?').get(domain);
    if (!allowed) return res.status(403).json({ error: '사내 이메일 주소만 가입할 수 있습니다.' });

    if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: '비밀번호는 영문+숫자 조합 6자 이상이어야 합니다.' });
    }
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
      return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
    }
    if (db.prepare('SELECT id FROM users WHERE nickname = ?').get(nickname)) {
      return res.status(409).json({ error: '이미 사용 중인 닉네임입니다.' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, nickname, password } = req.body;

    if (!email || !nickname || !password) {
      return res.status(400).json({ error: '이메일, 닉네임, 비밀번호를 모두 입력해주세요.' });
    }

    // Domain validation
    const domain = email.split('@')[1];
    if (!domain) {
      return res.status(400).json({ error: '유효하지 않은 이메일 형식입니다.' });
    }

    const db = getDb();
    const allowed = db.prepare('SELECT id FROM allowed_domains WHERE domain = ?').get(domain);
    if (!allowed) {
      return res.status(403).json({ error: '사내 이메일 주소만 가입할 수 있습니다.' });
    }

    // Password rule: 영문+숫자 6자+
    if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: '비밀번호는 영문+숫자 조합 6자 이상이어야 합니다.' });
    }

    // Duplicate check
    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingEmail) {
      return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
    }

    const existingNick = db.prepare('SELECT id FROM users WHERE nickname = ?').get(nickname);
    if (existingNick) {
      return res.status(409).json({ error: '이미 사용 중인 닉네임입니다.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (email, nickname, password_hash) VALUES (?, ?, ?)'
    ).run(email, nickname, password_hash);

    const user = db.prepare('SELECT id, email, nickname, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, email: user.email, nickname: user.nickname }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, nickname: user.nickname }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, nickname: user.nickname, created_at: user.created_at } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, email, nickname, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
  res.json(user);
});

module.exports = router;
