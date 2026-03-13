const express = require('express');
const { getDb } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const VALID_TAGS = ['팝니다', '삽니다', '나눕니다', '같이삽시다'];
const VALID_STATUSES = ['가능', '완료'];

// GET /api/products
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { search, tag, page = 1, showDone } = req.query;
    const limit = 12;
    const offset = (parseInt(page) - 1) * limit;

    let where = 'WHERE 1=1';
    const params = [];

    if (showDone !== 'true') {
      where += " AND p.status = '가능'";
    }
    if (search) {
      where += ' AND (p.title LIKE ? OR COALESCE(u.nickname, \'\') LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (tag && VALID_TAGS.includes(tag)) {
      where += ' AND p.tag = ?';
      params.push(tag);
    }

    const total = db.prepare(`
      SELECT COUNT(*) as cnt
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      ${where}
    `).get(...params).cnt;

    const products = db.prepare(`
      SELECT p.id, p.title, p.description, p.tag, p.status, p.price, p.is_negotiable, p.max_participants,
             p.created_at, p.updated_at,
             p.user_id, COALESCE(u.nickname, '탈퇴한 사용자') as nickname,
             (SELECT COUNT(*) FROM comments WHERE product_id = p.id) as comment_count,
             (SELECT content FROM comments WHERE product_id = p.id ORDER BY created_at DESC LIMIT 1) as latest_comment_content,
             (SELECT u2.nickname FROM comments c2 LEFT JOIN users u2 ON c2.user_id = u2.id WHERE c2.product_id = p.id ORDER BY c2.created_at DESC LIMIT 1) as latest_comment_nickname,
             (SELECT COUNT(*) FROM group_buy_participants WHERE product_id = p.id) as participant_count
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      ${where}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare(`
      SELECT p.id, p.title, p.description, p.tag, p.status, p.price, p.is_negotiable, p.max_participants,
             p.created_at, p.updated_at,
             p.user_id, COALESCE(u.nickname, '탈퇴한 사용자') as nickname,
             (SELECT COUNT(*) FROM group_buy_participants WHERE product_id = p.id) as participant_count
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(req.params.id);

    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /api/products
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, description, tag, price, is_negotiable, max_participants } = req.body;

    if (!title || !description || !tag) {
      return res.status(400).json({ error: '제목, 설명, 태그를 모두 입력해주세요.' });
    }
    if (!VALID_TAGS.includes(tag)) {
      return res.status(400).json({ error: '태그는 팝니다, 삽니다, 나눕니다, 같이삽시다 중 하나여야 합니다.' });
    }

    const priceVal = price ? parseInt(price) : null;
    const negotiable = is_negotiable ? 1 : 0;
    const maxPart = max_participants ? parseInt(max_participants) : null;

    const db = getDb();
    const result = db.prepare(
      'INSERT INTO products (user_id, title, description, tag, price, is_negotiable, max_participants) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(req.user.id, title, description, tag, priceVal, negotiable, maxPart);

    const product = db.prepare(`
      SELECT p.id, p.title, p.description, p.tag, p.status, p.price, p.is_negotiable, p.max_participants,
             p.created_at, p.updated_at,
             p.user_id, COALESCE(u.nickname, '탈퇴한 사용자') as nickname,
             0 as participant_count
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// PUT /api/products/:id
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    if (product.user_id !== req.user.id) return res.status(403).json({ error: '수정 권한이 없습니다.' });

    const { title, description, tag, status, price, is_negotiable, max_participants } = req.body;

    if (tag && !VALID_TAGS.includes(tag)) {
      return res.status(400).json({ error: '태그는 팝니다, 삽니다, 나눕니다, 같이삽시다 중 하나여야 합니다.' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: '올바르지 않은 상태값입니다.' });
    }

    const priceVal = price !== undefined ? (price === null || price === '' ? null : parseInt(price)) : undefined;
    const negotiable = is_negotiable !== undefined ? (is_negotiable ? 1 : 0) : undefined;
    const maxPart = max_participants !== undefined ? (max_participants === null || max_participants === '' ? null : parseInt(max_participants)) : undefined;

    db.prepare(`
      UPDATE products
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          tag = COALESCE(?, tag),
          status = COALESCE(?, status),
          price = CASE WHEN ? IS NOT NULL THEN ? ELSE price END,
          is_negotiable = CASE WHEN ? IS NOT NULL THEN ? ELSE is_negotiable END,
          max_participants = CASE WHEN ? IS NOT NULL THEN ? ELSE max_participants END,
          updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(
      title || null, description || null, tag || null, status || null,
      priceVal !== undefined ? String(priceVal) : null, priceVal !== undefined ? priceVal : null,
      negotiable !== undefined ? String(negotiable) : null, negotiable !== undefined ? negotiable : null,
      maxPart !== undefined ? String(maxPart) : null, maxPart !== undefined ? maxPart : null,
      req.params.id
    );

    const updated = db.prepare(`
      SELECT p.id, p.title, p.description, p.tag, p.status, p.price, p.is_negotiable, p.max_participants,
             p.created_at, p.updated_at,
             p.user_id, COALESCE(u.nickname, '탈퇴한 사용자') as nickname,
             (SELECT COUNT(*) FROM group_buy_participants WHERE product_id = p.id) as participant_count
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(req.params.id);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!product) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    if (product.user_id !== req.user.id) return res.status(403).json({ error: '삭제 권한이 없습니다.' });

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: '상품이 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
