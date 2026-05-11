const db = require("../database/db");

class CourseController {

    static create(req, res) {

        const {
            name,
            description,
            start_date,
            end_date
        } = req.body;

        // usuário vem do middleware JWT
        const creator_id = req.user.id;

        // validações
        if (!name || !start_date || !end_date) {
            return res.status(400).json({
                error: "Campos obrigatórios faltando"
            });
        }

        if (name.length < 3) {
            return res.status(400).json({
                error: "Nome deve ter pelo menos 3 caracteres"
            });
        }

        // valida datas
        if (end_date < start_date) {
            return res.status(400).json({
                error: "Data final inválida"
            });
        }

        db.run(
            `
            INSERT INTO courses
            (name, description, start_date, end_date, creator_id)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                name,
                description,
                start_date,
                end_date,
                creator_id
            ],
            function(err) {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        error: "Erro ao criar curso"
                    });
                }

                return res.status(201).json({
                    message: "Curso criado",
                    courseId: this.lastID
                });
            }
        );
    }

    static index(req, res) {

    db.all(
        `
        SELECT
            courses.id,
            courses.name,
            courses.description,
            courses.start_date,
            courses.end_date,
            users.name AS creator_name
        FROM courses
        JOIN users
        ON courses.creator_id = users.id
        `,
        [],
        (err, courses) => {

            if (err) {

                return res.status(500).json({
                    error: "Erro ao buscar cursos"
                });
            }

            return res.json(courses);
        }
    );
    }
    static show(req, res) {

    const { id } = req.params;

    db.get(
        `
        SELECT
            courses.id,
            courses.name,
            courses.description,
            courses.start_date,
            courses.end_date,
            users.name AS creator_name
        FROM courses
        JOIN users
        ON courses.creator_id = users.id
        WHERE courses.id = ?
        `,
        [id],
        (err, course) => {

            if (err) {

                return res.status(500).json({
                    error: "Erro ao buscar curso"
                });
            }

            if (!course) {

                return res.status(404).json({
                    error: "Curso não encontrado"
                });
            }

            return res.json(course);
        }
    );
    }
    static update(req, res) {

    const { id } = req.params;

    const {
        name,
        description,
        start_date,
        end_date
    } = req.body;

    const user_id = req.user.id;

    // busca curso
    db.get(
        "SELECT * FROM courses WHERE id = ?",
        [id],
        (err, course) => {

            if (err) {

                return res.status(500).json({
                    error: "Erro no banco"
                });
            }

            if (!course) {

                return res.status(404).json({
                    error: "Curso não encontrado"
                });
            }

            // verifica criador
            if (course.creator_id !== user_id) {

                return res.status(403).json({
                    error: "Sem permissão"
                });
            }

            // validações
            if (!name || !start_date || !end_date) {

                return res.status(400).json({
                    error: "Campos obrigatórios"
                });
            }

            if (name.length < 3) {

                return res.status(400).json({
                    error: "Nome inválido"
                });
            }

            if (end_date < start_date) {

                return res.status(400).json({
                    error: "Datas inválidas"
                });
            }

            // atualiza
            db.run(
                `
                UPDATE courses
                SET
                    name = ?,
                    description = ?,
                    start_date = ?,
                    end_date = ?
                WHERE id = ?
                `,
                [
                    name,
                    description,
                    start_date,
                    end_date,
                    id
                ],
                function(err) {

                    if (err) {

                        return res.status(500).json({
                            error: "Erro ao atualizar"
                        });
                    }

                    return res.json({
                        message: "Curso atualizado"
                    });
                }
            );
        }
    );
    }
    static delete(req, res) {

    const { id } = req.params;

    const user_id = req.user.id;

    // procura curso
    db.get(
        "SELECT * FROM courses WHERE id = ?",
        [id],
        (err, course) => {

            if (err) {

                return res.status(500).json({
                    error: "Erro no banco"
                });
            }

            if (!course) {

                return res.status(404).json({
                    error: "Curso não encontrado"
                });
            }

            // verifica dono
            if (course.creator_id !== user_id) {

                return res.status(403).json({
                    error: "Sem permissão"
                });
            }

            // remove curso
            db.run(
                "DELETE FROM courses WHERE id = ?",
                [id],
                function(err) {

                    if (err) {

                        return res.status(500).json({
                            error: "Erro ao deletar curso"
                        });
                    }

                    return res.json({
                        message: "Curso deletado"
                    });
                }
            );
        }
    );
    }
}

module.exports = CourseController;