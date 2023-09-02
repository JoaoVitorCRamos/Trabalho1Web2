const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware para autenticação (authenticator.js)
app.use((req, res, next) => {
  // Implemente a autenticação aqui
  next();
});

// Middleware para contagem de curtidas (liked_counter.js)
app.use((req, res, next) => {
  // Implemente a contagem de curtidas aqui
  next();
});

// Rotas
const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');

app.use('/articles', articlesRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:3000`);
});
