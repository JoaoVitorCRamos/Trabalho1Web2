const express = require("express");
const app = express();
const articlesData = require("./data/articles.json");
const bodyParser = require("body-parser"); 
const authenticateUser = require("./middwares/authenticator");
const likedCounter = require('./middwares/liked_counter');
const userData = require("./data/users.json");
const fs = require('fs'); 
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.render(__dirname + '/views/index.ejs', {articles : articlesData});
});

app.get("/create-edit/usuario/:userId", function(req, res){
    const userId = req.params.userId;
    const user = userData.find((userData) => userData.author_id === userId);

    if (user && user.author_status === "active" && user.author_level === "admin") {
        res.render(__dirname + '/views/users_create.ejs', {user : userData});
    } else {
        res.status(404).send("<h1>Erro ao acessar!</h1>");
    }
}).post("/create-edit/usuario/:userId", function(req, res) {
    const userId = req.params.userId;
    const user = userData.find((userData) => userData.author_id === userId);


    // Pegar dados digitados
    const author_name = req.body.author_name;
    const author_email = req.body.author_email;
    const author_user = req.body.author_user;
    const author_pwd = req.body.author_pwd;
    const author_level = req.body.author_level;
    const author_status = "active";

    // Gerar ID
    const lastUser = userData[userData.length - 1];
    const lastId = lastUser ? parseInt(lastUser.author_id) : 0;
    const author_id = (lastId + 1).toString();

    // Cria e posta os artigos
    const newUser = {
        author_id, 
        author_name,
        author_email,
        author_user,
        author_pwd,
        author_level,
        author_status
    };
    userData.push(newUser);

    const userFilePath = path.join(__dirname, 'data', 'users.json');
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));

    // Vai para a página do artigo
    res.redirect(`http://localhost:8081/administracao/${userId}`);
});

//pagina de criar artigo
app.get("/article/create/:userId", function(req, res) {
    const userId = req.params.userId;
    const user = userData.find((userData) => userData.author_id === userId);

    if (user && user.author_status === "active") {
        res.render(__dirname + '/views/articles_create.ejs');
    } else {
        res.status(404).send("<h1>Usuario nao cadastrado ou desativado!</h1>");
    }
}).post("/article/create/:userId", function(req, res) {
    const userId = req.params.userId;
    const user = userData.find((userData) => userData.author_id === userId);

    if (!user) {
        return res.status(404).send("<h1>Usuario nao cadastrado ou desativado!</h1>");
    }

    // Pegar dados digitados
    const kb_title = req.body.kb_title;
    const kb_body = req.body.kb_body;
    const kb_keywords = req.body.kb_keywords;
    const kb_author_email = user.author_email;
    
    // Gerar ID
    const lastArticle = articlesData[articlesData.length - 1];
    const lastId = lastArticle ? parseInt(lastArticle.kb_id) : 0;
    const kb_id = (lastId + 1).toString();

    // Gerar permalink
    let kb_permalink = kb_title.toLowerCase().replace(/ /g, "-");
    let permalinkExists = articlesData.some(article => article.kb_permalink === kb_permalink);

    if (permalinkExists) {
        let counter = 1;
        let originalPermalink = kb_permalink;
        do {
            kb_permalink = originalPermalink + '-' + counter;
            permalinkExists = articlesData.some(article => article.kb_permalink === kb_permalink);
            counter++;
        } while (permalinkExists);
    }

    // Valores padrões do artigo
    const kb_liked_count = 0;
    const kb_published = true;
    const kb_suggestion = false;
    const kb_featured = false;

    // Coletor de datas
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const year = currentDate.getFullYear();

    const kb_published_date = `${day}-${month}-${year}`;

    // Cria e posta os artigos
    const newArticle = {
        kb_id, 
        kb_title,
        kb_body,
        kb_permalink,
        kb_keywords,
        kb_liked_count,
        kb_published,
        kb_suggestion,
        kb_featured,
        kb_author_email,
        kb_published_date
    };
    articlesData.push(newArticle);

    const articlesFilePath = path.join(__dirname, 'data', 'articles.json');
    fs.writeFileSync(articlesFilePath, JSON.stringify(articlesData, null, 2));

    // Vai para a página do artigo
    res.redirect(`/article/${kb_permalink}`);
});

//pagina de usuario
app.get("/usuario/:userId", function(req, res) {
    const userId = req.params.userId;
    const user = userData.find((userData) => userData.author_id === userId);

    //checa se existe alguem com esse usuario

    if (user && user.author_status === "active") {
        res.render(__dirname + '/views/user.ejs', {articles : articlesData, user: user});
    } else {
        res.status(403).send("Acesso negado. Usuario não cadastrado ou sua conta foi desativada.:c");
    }
});

//pagina administracao
app.get("/administracao/:userId", function(req, res) {
    const userId = req.params.userId;
    const user = userData.find((userData) => userData.author_id === userId);

    //checar se estao tentando passar a perna nos adms

    if (user && user.author_level === "admin" && user.author_status === "active") {
        res.render(__dirname + '/views/admin.ejs', {articles : articlesData, user: user});
    } else {
        res.status(403).send("Acesso negado. Você não é um administrador ou sua conta foi desativada. :c");
    }
});

//pagina de login
app.route("/login").get(function (req, res) {

    res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/style/login.css">
            <title>Document</title>
        </head>
        <body>
            <div>
                <div>
                    <h1>Login</h1>
                    <a href="http://localhost:8081/">Home</a>
                </div>
                <form action="/login" method="POST">
                    <label for="login">Usuário:</label>
                    <input type="text" id="login" name="login"><br>
                    <label for="password">Senha:</label>
                    <input type="password" id="password" name="password"><br>
                    <input type="submit" value="login">
                </form>
            </div>
        </body>
    </html>
    `);

}).post(authenticateUser);

//pagina de artigos
app.get("/article/:permalink", function (req, res) {
    const permalink = req.params.permalink;

    // Procurar o artigo pelo permalink no array de artigos
    const article = articlesData.find((a) => a.kb_permalink === permalink);
    const user = userData.find((u) => u.author_email === article.kb_author_email);

    if (article) {
        res.render(__dirname + '/views/articles_read.ejs', {article : article, user : user});
    } else {
        res.status(404).send("Artigo não encontrado :c");
    }
}).post('/like-article/:articleId', likedCounter);

app.listen(8081, function(){
    console.log("servidor rodando suavao em http://localhost:8081/");
});