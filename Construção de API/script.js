async function fetchRandomUser() {
  try {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const user = data.results[0];

    document.getElementById("user-info").innerHTML = `
            <p>Nome: ${user.name.first} ${user.name.last}</p>
            <p>Email: ${user.email}</p>
            <p>Data de Nascimento: ${new Date(
              user.dob.date
            ).toLocaleDateString()}</p>
            <p>Idade: ${user.dob.age}</p>
        `;
  } catch (error) {
    console.error("Erro ao buscar dados", error);
  }
}

const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());

let users = [];

function loadUsers() {
  try {
    const data = fs.readFileSync("users.json", "utf8");
    users = JSON.parse(data);
  } catch (error) {
    users = [];
  }
}

function saveUsers() {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

app.post("/users", (req, res) => {
  const user = req.body;
  users.push(user);
  saveUsers();
  res.status(201).send("Usuário adicionado com sucesso");
});

app.get("/users", (req, res) => {
  res.json(users);
});

loadUsers();
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

const { check, validationResult } = require("express-validator");

app.post(
  "/users",
  [
    check("name.first").notEmpty().withMessage("Primeiro nome é obrigatório"),
    check("email").isEmail().withMessage("E-mail inválido"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.body;
    users.push(user);
    saveUsers();
    res.status(201).send("Usuário adicionado com sucesso");
  }
);
