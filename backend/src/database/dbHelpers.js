const db = require("./db");

// O driver `sqlite3` só trabalha com callbacks. Estes wrappers existem para
// permitir async/await nas partes novas do código (controller de upload e
// repository de legendas) sem precisar trocar o driver ou reescrever as
// rotas antigas que já usam callback diretamente.

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        // Precisa de "function" (não arrow function) para o sqlite3
        // conseguir bindar `this.lastID` / `this.changes` no callback.
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

module.exports = { dbGet, dbAll, dbRun };
