const fs = require('fs');
const path = require('path');

function likedCounter(req, res, next) {
  const articleId = req.params.articleId;

  const articlesFilePath = path.join(__dirname, '../data', 'articles.json');
  const articlesData = require(articlesFilePath);

  const article = articlesData.find((a) => a.kb_id === articleId);

  if (article) {
    article.kb_liked_count++;

    fs.writeFileSync(articlesFilePath, JSON.stringify(articlesData, null, 2));

    res.redirect(`/article/${article.kb_permalink}`);
  } else {
    res.status(404).send('Article not found');
  }
}

module.exports = likedCounter;
