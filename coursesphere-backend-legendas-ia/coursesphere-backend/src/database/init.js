const db = require("./db");

// Colunas novas que a feature de legendas automáticas precisa na tabela lessons.
// Usamos ALTER TABLE (e não apenas o CREATE TABLE abaixo) porque o SQLite não
// tem "ADD COLUMN IF NOT EXISTS" — sem isso, bancos já existentes (criados antes
// desta alteração) nunca ganhariam as novas colunas.
const LESSON_SUBTITLE_COLUMNS = [
    { name: "subtitle_url", definition: "TEXT" },
    { name: "subtitle_status", definition: "TEXT NOT NULL DEFAULT 'none'" },
    { name: "subtitle_error", definition: "TEXT" }
];

function ensureLessonSubtitleColumns() {
    db.all("PRAGMA table_info(lessons)", [], (err, columns) => {

        if (err) {
            console.error("Erro ao inspecionar tabela lessons:", err.message);
            return;
        }

        const existingColumns = columns.map((col) => col.name);

        LESSON_SUBTITLE_COLUMNS
            .filter((column) => !existingColumns.includes(column.name))
            .forEach((column) => {
                db.run(
                    `ALTER TABLE lessons ADD COLUMN ${column.name} ${column.definition}`,
                    (alterErr) => {
                        if (alterErr) {
                            console.error(
                                `Erro ao adicionar coluna ${column.name} em lessons:`,
                                alterErr.message
                            );
                        } else {
                            console.log(`Coluna ${column.name} adicionada em lessons`);
                        }
                    }
                );
            });
    });
}

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            creator_id INTEGER NOT NULL,
            FOREIGN KEY (creator_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            video_url TEXT,
            subtitle_url TEXT,
            subtitle_status TEXT NOT NULL DEFAULT 'none',
            subtitle_error TEXT,
            course_id INTEGER NOT NULL,
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )
    `);

    // Cobre o caso de quem já tinha o banco criado antes desta versão.
    ensureLessonSubtitleColumns();

    console.log("Tabelas criadas");
});