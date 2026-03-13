const express = require('express');
const { getDb } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');

// --- /api/products/:id/join ---
const joinRouter = express.Router({ mergeParams: true });

// GET /api/products/:id/join — 현재 유저의 참여 여부
joinRouter.get('/', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare('SELECT id FROM group_buy_participants WHERE product_id = ? AND user_id = ?').get(req.params.id, req.user.id);
    const count = db.prepare('SELECT COUNT(*) as cnt FROM group_buy_participants WHERE product_id = ?').get(req.params.id).cnt;
    res.json({ joined: !!row, participant_count: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /api/products/:id/join — 한 배에 타기
joinRouter.post('/', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    if (product.tag !== '같이삽시다') return res.status(400).json({ error: '같이삽시다 게시글만 참여할 수 있습니다.' });
    if (product.user_id === req.user.id) return res.status(400).json({ error: '본인 게시글에는 참여할 수 없습니다.' });

    const count = db.prepare('SELECT COUNT(*) as cnt FROM group_buy_participants WHERE product_id = ?').get(req.params.id).cnt;
    if (product.max_participants && count >= product.max_participants) {
      return res.status(400).json({ error: '최대 인원이 모두 찼습니다.' });
    }

    try {
      db.prepare('INSERT INTO group_buy_participants (product_id, user_id) VALUES (?, ?)').run(req.params.id, req.user.id);
    } catch {
      return res.status(400).json({ error: '이미 참여 중입니다.' });
    }

    const newCount = db.prepare('SELECT COUNT(*) as cnt FROM group_buy_participants WHERE product_id = ?').get(req.params.id).cnt;
    res.json({ joined: true, participant_count: newCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// DELETE /api/products/:id/join — 배에서 하차하기
joinRouter.delete('/', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM group_buy_participants WHERE product_id = ? AND user_id = ?').run(req.params.id, req.user.id);

    if (result.changes === 0) return res.status(400).json({ error: '참여 중이 아닙니다.' });

    const count = db.prepare('SELECT COUNT(*) as cnt FROM group_buy_participants WHERE product_id = ?').get(req.params.id).cnt;
    res.json({ joined: false, participant_count: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// --- /api/products/:id/participants ---
const participantsRouter = express.Router({ mergeParams: true });

// GET /api/products/:id/participants — 참여자 이메일 목록 (작성자만)
participantsRouter.get('/', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    if (product.user_id !== req.user.id) return res.status(403).json({ error: '작성자만 참여자 목록을 볼 수 있습니다.' });

    const participants = db.prepare(`
      SELECT u.email, u.nickname
      FROM group_buy_participants g
      JOIN users u ON g.user_id = u.id
      WHERE g.product_id = ?
      ORDER BY g.created_at ASC
    `).all(req.params.id);

    res.json(participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = { joinRouter, participantsRouter };
