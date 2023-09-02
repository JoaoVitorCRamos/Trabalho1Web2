const express = require('express');
const router = express.Router();
const fs = require('fs');

// Rota para a página inicial (home)
router.get('/', (req, res) => {
  // Ler os artigos do arquivo articles.json
  fs.readFile('./data/articles.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    
    const articles = JSON.parse(data);
    
    // Filtrar os artigos em destaque (kb_featured = true)
    const featuredArticles = articles.filter((article) => article.kb_featured === true);
    
    // Ordenar os artigos por curtidas (kb_liked_count) em ordem decrescente
    const sortedArticles = articles.sort((a, b) => b.kb_liked_count - a.kb_liked_count);
    
    res.render('index', { featuredArticles, sortedArticles });
  });
});

// Rota para a pesquisa de artigos por palavra-chave
router.get('/search', (req, res) => {
  const { keyword } = req.query;
  
  // Ler os artigos do arquivo articles.json
  fs.readFile('./data/articles.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    
    const articles = JSON.parse(data);
    
    // Filtrar os artigos que contêm a palavra-chave nas kb_keywords
    const matchingArticles = articles.filter((article) => article.kb_keywords.includes(keyword));
    
    res.render('search', { matchingArticles, keyword });
  });
});

module.exports = router;
