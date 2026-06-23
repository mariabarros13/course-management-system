const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log("Erro ao conectar banco");
    } else {
        console.log("Banco conectado");
    }
});

module.exports = db;