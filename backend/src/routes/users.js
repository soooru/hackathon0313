const express = require('express');
const { getDb } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/me/products
router.get('/me/products', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const products = db.prepare(`
      SELECT p.id, p.title, p.description, p.tag, p.status, p.created_at, p.updated_at,
             u.id as user_id, u.nickname
      FROM products p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `).all(req.user.id);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// DELETE /api/users/me — 회원탈퇴 (게시글·댓글은 user_id=NULL로 유지)
router.delete('/me', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id);
    res.json({ message: '계정이 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
