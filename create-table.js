require("dotenv").config();
const sql = require("mssql");

const config = {
    server: process.env.SERVER,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log("Conectado ao SQL com sucesso!");
        return pool;
    } catch (err) {
        console.error("Erro ao conectar:", err);
    }
}

connectDB();
