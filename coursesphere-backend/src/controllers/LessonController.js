const db = require("../database/db");

class LessonController {

    static create(req, res) {

        const {
            title,
            status,
            video_url,
            course_id
        } = req.body;

        const user_id = req.user.id;

        // validações
        if (!title || !status || !course_id) {

            return res.status(400).json({
                error: "Campos obrigatórios"
            });
        }

        if (title.length < 3) {

            return res.status(400).json({
                error: "Título inválido"
            });
        }

        // status válido
        if (
            status !== "draft" &&
            status !== "published"
        ) {

            return res.status(400).json({
                error: "Status inválido"
            });
        }

        // verifica se curso existe
        db.get(
            "SELECT * FROM courses WHERE id = ?",
            [course_id],
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

                // verifica dono do curso
                if (
                        Number(course.creator_id) !==
                        Number(user_id)
                ) {

                    return res.status(403).json({
                        error: "Sem permissão"
                    });
                }

                // cria lesson
                db.run(
                    `
                    INSERT INTO lessons
                    (title, status, video_url, course_id)
                    VALUES (?, ?, ?, ?)
                    `,
                    [
                        title,
                        status,
                        video_url,
                        course_id
                    ],
                    function(err) {

                        if (err) {

                            return res.status(500).json({
                                error: "Erro ao criar aula"
                            });
                        }

                        return res.status(201).json({
                            message: "Lesson criada",
                            lessonId: this.lastID
                        });
                    }
                );
            }
        );
    }
    static indexByCourse(req, res) {

    const { id } = req.params;

    // verifica se curso existe
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

            // busca lessons
            db.all(
                `
                SELECT *
                FROM lessons
                WHERE course_id = ?
                `,
                [id],
                (err, lessons) => {

                    if (err) {

                        return res.status(500).json({
                            error: "Erro ao buscar aulas"
                        });
                    }

                    return res.json(lessons);
                }
            );
        }
    );
    }

    static delete(req, res) {

    const { id } = req.params;

    const user_id = req.user.id;

    // busca lesson
    db.get(
        "SELECT * FROM lessons WHERE id = ?",
        [id],
        (err, lesson) => {

            if (err) {

                return res.status(500).json({
                    error: "Erro no banco"
                });
            }

            if (!lesson) {

                return res.status(404).json({
                    error: "Lesson não encontrada"
                });
            }

            // busca curso da lesson
            db.get(
                "SELECT * FROM courses WHERE id = ?",
                [lesson.course_id],
                (err, course) => {

                    if (err) {

                        return res.status(500).json({
                            error: "Erro no banco"
                        });
                    }

                    // verifica dono
                    if (
                        Number(course.creator_id) !==
                        Number(user_id)
                    ) {

                        return res.status(403).json({
                            error: "Sem permissão"
                        });
                    }

                    // remove lesson
                    db.run(
                        "DELETE FROM lessons WHERE id = ?",
                        [id],
                        function(err) {

                            if (err) {

                                return res.status(500).json({
                                    error: "Erro ao deletar lesson"
                                });
                            }

                            return res.json({
                                message: "Lesson deletada"
                            });
                        }
                    );
                }
            );
        }
    );
  }
  static update(req, res) {

    const { id } = req.params;

    const {
        title,
        status,
        video_url
    } = req.body;

    const user_id = req.user.id;

    // validações
    if (!title || !status) {

        return res.status(400).json({
            error: "Campos obrigatórios"
        });
    }

    if (title.length < 3) {

        return res.status(400).json({
            error: "Título inválido"
        });
    }

    if (
        status !== "draft" &&
        status !== "published"
    ) {

        return res.status(400).json({
            error: "Status inválido"
        });
    }

    // busca lesson
    db.get(
        "SELECT * FROM lessons WHERE id = ?",
        [id],
        (err, lesson) => {

            if (err) {

                return res.status(500).json({
                    error: "Erro no banco"
                });
            }

            if (!lesson) {

                return res.status(404).json({
                    error: "Lesson não encontrada"
                });
            }

            // busca curso da lesson
            db.get(
                "SELECT * FROM courses WHERE id = ?",
                [lesson.course_id],
                (err, course) => {

                    if (err) {

                        return res.status(500).json({
                            error: "Erro no banco"
                        });
                    }

                    // verifica dono
                    if (
                        Number(course.creator_id) !==
                        Number(user_id)
                    ) {

                        return res.status(403).json({
                            error: "Sem permissão"
                        });
                    }

                    // atualiza lesson
                    db.run(
                        `
                        UPDATE lessons
                        SET
                            title = ?,
                            status = ?,
                            video_url = ?
                        WHERE id = ?
                        `,
                        [
                            title,
                            status,
                            video_url,
                            id
                        ],
                        function(err) {

                            if (err) {

                                return res.status(500).json({
                                    error: "Erro ao atualizar lesson"
                                });
                            }

                            return res.json({
                                message: "Lesson atualizada"
                            });
                        }
                    );
                }
            );
        }
    );
}
}

module.exports = LessonController;