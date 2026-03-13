const express = require('express');
const { getDb } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/messages — 내 대화 목록
router.get('/', authMiddleware, (req, res) => {
  const me = req.user.id;
  const db = getDb();

  const rows = db.prepare(`
    SELECT m.*,
      COALESCE(us.nickname, '탈퇴한 사용자') as sender_nickname,
      COALESCE(ur.nickname, '탈퇴한 사용자') as receiver_nickname,
      p.title as product_title
    FROM messages m
    LEFT JOIN users us ON us.id = m.sender_id
    LEFT JOIN users ur ON ur.id = m.receiver_id
    LEFT JOIN products p ON p.id = m.product_id
    WHERE m.sender_id = ? OR m.receiver_id = ?
    ORDER BY m.created_at DESC
  `).all(me, me);

  // 상대방별로 묶어서 대화 목록 생성 (DESC 정렬이므로 첫 번째가 최신)
  const convMap = new Map();
  for (const msg of rows) {
    const partnerId = msg.sender_id === me ? msg.receiver_id : msg.sender_id;
    const partnerNickname = msg.sender_id === me ? msg.receiver_nickname : msg.sender_nickname;

    if (!convMap.has(partnerId)) {
      convMap.set(partnerId, {
        partner_id: partnerId,
        partner_nickname: partnerNickname,
        last_content: msg.content,
        last_created_at: msg.created_at,
        product_id: msg.product_id,
        product_title: msg.product_title,
        unread_count: 0,
      });
    }
    if (msg.receiver_id === me && msg.is_read === 0) {
      convMap.get(partnerId).unread_count++;
    }
  }

  res.json(Array.from(convMap.values()));
});

// GET /api/messages/unread-count — 읽지 않은 쪽지 수 (/:partnerId 보다 먼저 등록)
router.get('/unread-count', authMiddleware, (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0').get(req.user.id);
  res.json({ count: row.count });
});

// GET /api/messages/:partnerId — 특정 상대와의 대화 + 읽음 처리
router.get('/:partnerId', authMiddleware, (req, res) => {
  const me = req.user.id;
  const partnerId = parseInt(req.params.partnerId);
  if (isNaN(partnerId)) return res.status(400).json({ error: '잘못된 요청입니다.' });

  const db = getDb();

  // 읽음 처리
  db.prepare('UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0').run(partnerId, me);

  const messages = db.prepare(`
    SELECT m.*,
      COALESCE(us.nickname, '탈퇴한 사용자') as sender_nickname,
      p.title as product_title
    FROM messages m
    LEFT JOIN users us ON us.id = m.sender_id
    LEFT JOIN products p ON p.id = m.product_id
    WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.created_at ASC
  `).all(me, partnerId, partnerId, me);

  const partner = db.prepare('SELECT id, nickname FROM users WHERE id = ?').get(partnerId);

  res.json({
    messages,
    partner: partner || { id: partnerId, nickname: '탈퇴한 사용자' },
  });
});

// POST /api/messages — 쪽지 보내기
router.post('/', authMiddleware, (req, res) => {
  const me = req.user.id;
  const { receiver_id, product_id, content } = req.body;

  if (!receiver_id || !content?.trim()) {
    return res.status(400).json({ error: '수신자와 내용을 입력해주세요.' });
  }
  if (receiver_id === me) {
    return res.status(400).json({ error: '자신에게는 쪽지를 보낼 수 없습니다.' });
  }

  const db = getDb();
  const receiver = db.prepare('SELECT id FROM users WHERE id = ?').get(receiver_id);
  if (!receiver) return res.status(404).json({ error: '수신자를 찾을 수 없습니다.' });

  const result = db.prepare(
    'INSERT INTO messages (sender_id, receiver_id, product_id, content) VALUES (?, ?, ?, ?)'
  ).run(me, receiver_id, product_id || null, content.trim());

  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(msg);
});

module.exports = router;
