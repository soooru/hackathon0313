const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const NOT_IMPLEMENTED = { error: '쪽지 기능은 준비 중입니다 (v2.0)' };

router.get('/', authMiddleware, (req, res) => res.status(501).json(NOT_IMPLEMENTED));
router.get('/:conversationId', authMiddleware, (req, res) => res.status(501).json(NOT_IMPLEMENTED));
router.post('/', authMiddleware, (req, res) => res.status(501).json(NOT_IMPLEMENTED));

module.exports = router;
