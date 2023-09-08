const express = require("express");
const app = express();
const articlesData = require("./data/articles.json");

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get("/article/:permalink", function (req, res) {
    const permalink = req.params.permalink;

    // Procurar o artigo pelo permalink no array de artigos
    const article = articlesData.find((a) => a.kb_permalink === permalink);

    if (article) {
        // Renderize a página com título, texto e botão "like"
        res.send(`
            <!DOCTYPE html>
            <html>
                <body>
                    <h1>${article.kb_title}</h1>
                    <p>${article.kb_body}</p>
                    <button id="likeButton">Like</button>
                    <script>
                        const likeButton = document.getElementById("likeButton");
                        let likes = ${article.kb_liked_count};

                        likeButton.addEventListener("click", function () {
                            likes++;
                            // Você pode adicionar a lógica para atualizar o contador de likes aqui.
                            // Por exemplo, você pode fazer uma solicitação ao servidor para atualizar o contador no JSON.

                            // Atualize o texto do botão para mostrar o novo número de likes
                            likeButton.innerText = "Like (" + likes + ")";
                        });
                    </script>
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