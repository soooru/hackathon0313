require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/init');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const commentsRouter = require('./routes/comments');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');
const { joinRouter, participantsRouter } = require('./routes/groupBuy');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/products/:id/comments', commentsRouter);
app.use('/api/products/:id/join', joinRouter);
app.use('/api/products/:id/participants', participantsRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

initDb();

app.listen(PORT, () => {
  console.log(`출근장터 서버 실행 중: http://localhost:${PORT}`);
});
