const express = require('express');
const router = express.Router();
const fs = require('fs');
const Article = require('../models/article'); // Certifique-se de ter o modelo adequado

// Rota para listar todos os artigos
router.get('/', (req, res) => {
  // Leia os artigos do arquivo articles.json
  fs.readFile('./data/articles.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    const articles = JSON.parse(data);
    res.render('articles/index', { articles });
  });
});

// Rota para exibir um formulário de criação de artigo
router.get('/create', (req, res) => {
  res.render('articles/create');
});

// Rota para criar um novo artigo
router.post('/create', (req, res) => {
  const { title, body, keywords, authorEmail } = req.body;

  // Crie uma instância do modelo de artigo
  const newArticle = new Article(
    generateId(), // Implemente uma função para gerar IDs únicos
    title,
    body,
    generatePermalink(title), // Implemente uma função para gerar permalinks
    keywords.split(','),
    0, // Inicialmente, o contador de curtidas é zero
    true, // Por padrão, o artigo é publicado
    false, // Por padrão, não é uma sugestão
    false, // Por padrão, não é destaque
    authorEmail,
    new Date().toISOString() // Use a data atual como data de publicação
  );

  // Leia os artigos existentes do arquivo articles.json
  fs.readFile('./data/articles.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    const articles = JSON.parse(data);

    // Adicione o novo artigo à lista de artigos
    articles.push(newArticle);

    // Escreva a lista atualizada de artigos de volta no arquivo
    fs.writeFile('./data/articles.json', JSON.stringify(articles, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      // Redirecione para a página de listagem de artigos após a criação bem-sucedida
      res.redirect('/articles');
    });
  });
});

// Outras rotas para editar, deletar e visualizar artigos podem ser adicionadas aqui

module.exports = router;
