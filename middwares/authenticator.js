const usersData = require("../data/users.json");

function authenticateUser(req, res, next) {
  const { login, password } = req.body;

  // achar o usuario
  const user = usersData.find((userData) => userData.author_user === login);

  if (!user || user.author_pwd !== password) {
    // verificar se a senha esta errada
    res.redirect("http://localhost:8081");
    return;
  }

  // Checar se é admin ou usuario comum
  if (user.author_level === "admin") {
    res.redirect(`http://localhost:8081/administracao/${user.author_id}`);
  } else if (user.author_level === "user") {
    res.redirect(`http://localhost:8081/user/${user.author_id}`);
  } else {
    // para erros diferentes vai pra ca
    res.redirect("http://localhost:8081");
  }
}

module.exports = authenticateUser;