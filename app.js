const express = require("express");
const app = express();
const articlesData = require("./data/articles.json");
const bodyParser = require("body-parser"); 
const authenticateUser = require("./middwares/authenticator");
const userData = require("./data/users.json");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.render(__dirname + '/views/index.ejs', {articles : articlesData});
});

//Cadastrar usuario
app.get("/article/create/:userId", function(req, res) {
    const userId = req.params.userId;
    const user = userData.find((userData) => userData.author_id === userId);

    if (user) {
        res.render(__dirname + '/views/articles_create.ejs');
    } else {
        res.status(404).send("<h1>ERRO AO TENTAR ACHAR O USUARIO!</h1>");
    }
});

//pagina administracao
app.get("/administracao/:userId", function(req, res) {
    const userId = req.params.userId;
    const user = userData.find((userData) => userData.author_id === userId);

    //checar se estao tentando passar a perna nos adms

    if (user && user.author_level === "admin") {
        res.render(__dirname + '/views/admin.ejs', {articles : articlesData, user: user});
    } else {
        res.status(403).send("Acesso negado. Você não é um administrador. :c");
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
});

app.listen(8081, function(){
    console.log("servidor rodando suavao em http://localhost:8081/");
});