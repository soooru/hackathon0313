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
    const userId = req.user.id;

    // DB 스키마 버전에 관계없이 직접 정리 후 삭제
    const withdraw = db.transaction(() => {
      db.prepare('DELETE FROM group_buy_participants WHERE user_id = ?').run(userId);
      db.prepare('UPDATE products SET user_id = NULL WHERE user_id = ?').run(userId);
      db.prepare('UPDATE comments SET user_id = NULL WHERE user_id = ?').run(userId);
      // messages는 FK 없이 유지 → sender_id/receiver_id 원래 값 보존
      // LEFT JOIN 시 user 없으면 COALESCE로 '탈퇴한 사용자' 표시
      db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    });
    withdraw();

    res.json({ message: '계정이 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
