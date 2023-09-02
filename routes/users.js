const express = require('express');
const router = express.Router();
const fs = require('fs');

// Rota para listar todos os usuários
router.get('/', (req, res) => {
  // Ler os usuários do arquivo users.json
  fs.readFile('./data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    const users = JSON.parse(data);
    res.render('users/index', { users });
  });
});

// Rota para exibir um formulário de criação de usuário
router.get('/create', (req, res) => {
  res.render('users/create');
});

// Rota para criar um novo usuário
router.post('/create', (req, res) => {
  const { name, email, user, password } = req.body;

  // Crie uma instância de usuário
  const newUser = {
    author_id: generateId(), // Implemente uma função para gerar IDs únicos
    author_name: name,
    author_email: email,
    author_user: user,
    author_pwd: hashPassword(password), // Implemente a função para criptografar a senha
    author_level: 'user', // Defina o nível do usuário conforme necessário
    author_status: 'on', // Por padrão, o usuário está ativado
  };

  // Ler os usuários existentes do arquivo users.json
  fs.readFile('./data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    const users = JSON.parse(data);

    // Adicione o novo usuário à lista de usuários
    users.push(newUser);

    // Escreva a lista atualizada de usuários de volta no arquivo
    fs.writeFile('./data/users.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      // Redirecione para a página de listagem de usuários após a criação bem-sucedida
      res.redirect('/users');
    });
  });
});

// Outras rotas para editar, desativar e visualizar usuários podem ser adicionadas aqui

module.exports = router;
