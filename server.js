require("dotenv").config();
const express = require("express");
const path = require("path");
const { connect, sql } = require("./db/connection");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// LOGIN
app.post("/login", async (req, res) => {
  const { login, senha } = req.body;

  try {
    const conn = await connect();
    const result = await conn.request()
      .input("login", sql.VarChar(50), login)
      .input("senha", sql.VarChar(50), senha)
      .query(`
        SELECT * FROM tblUsuario 
        WHERE Login = @login AND Senha = @senha
      `);

    if (result.recordset.length > 0) {
      res.redirect("/buscar.html");
    } else {
      res.send("Usuário ou senha inválidos");
    }

  } catch (err) {
    console.error(err);
    res.send("Erro no servidor");
  }
});

app.post("/buscar", async (req, res) => {
  const { termo } = req.body;

  try {
    const conn = await connect();
    const result = await conn.request()
      .input("placa", sql.VarChar(10), termo)
      .query(`
        SELECT 
          Placa,
          Marca,
          Modelo,
          AnoModelo,
          Cor,
          UF,
          Chassi,
          Renavan
        FROM tblVeiculo
        WHERE Placa = @placa
      `);

    if (result.recordset.length > 0) {
      const dados = encodeURIComponent(JSON.stringify(result.recordset[0]));
      res.redirect(`/resultado.html?dados=${dados}`);
    } else {
      res.send("Veículo não encontrado");
    }

  } catch (err) {
    console.error("ERRO BUSCA:", err);
    res.send(err.message);
  }
});


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
