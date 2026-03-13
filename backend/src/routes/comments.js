const express = require('express');
const { getDb } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// GET /api/products/:id/comments
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

    const comments = db.prepare(`
      SELECT c.id, c.content, c.created_at, c.user_id, COALESCE(u.nickname, '탈퇴한 사용자') as nickname
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.product_id = ?
      ORDER BY c.created_at ASC
    `).all(req.params.id);

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /api/products/:id/comments
router.post('/', authMiddleware, (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
    }

    const db = getDb();
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

    const result = db.prepare(
      'INSERT INTO comments (product_id, user_id, content) VALUES (?, ?, ?)'
    ).run(req.params.id, req.user.id, content.trim());

    const comment = db.prepare(`
      SELECT c.id, c.content, c.created_at, c.user_id, COALESCE(u.nickname, '탈퇴한 사용자') as nickname
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
