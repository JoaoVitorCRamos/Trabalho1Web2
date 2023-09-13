const express = require("express");
const app = express();
const articlesData = require("./data/articles.json");
const userData = require("./data/users.json")

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

//editar usuario
app.get("/useredit/", function(req, res) {
    res.sendFile(__dirname + '/views/users_edit.html');
});

//Cadastrar usuario
app.get("/usercreate", function(req, res) {
    res.sendFile(__dirname + '/views/users_create.html');
});

//pagina administracao
app.get("/administracao/", function(req, res) {
    res.sendFile(__dirname + '/views/admin.html');
});

//pagina de login
app.get("/login", function (req, res) {

    res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
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
        </body>
    </html>
    `);

});

//pagina de artigos
app.get("/article/:permalink", function (req, res) {
    const permalink = req.params.permalink;

    // Procurar o artigo pelo permalink no array de artigos
    const article = articlesData.find((a) => a.kb_permalink === permalink);

    if (article) {
        // Renderiza a página com título, texto e botão "like"
        res.send(`
            <!DOCTYPE html>
            <html>
                <body>
                    <div>
                        <a href="http://localhost:8081/">Home</a>
                    </div>
                    <h1>${article.kb_title}</h1>
                    <p>${article.kb_body}</p>
                    <button id="likeButton">Like</button>
                </body>
            </html>
        `);
    } else {
        res.status(404).send("Artigo não encontrado :c");
    }
});

app.listen(8081, function(){
    console.log("servidor rodando suavao");
});