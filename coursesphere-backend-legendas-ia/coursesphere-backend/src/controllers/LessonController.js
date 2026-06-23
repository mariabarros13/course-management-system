const path = require("path");

const db = require("../database/db");
const { dbGet, dbRun } = require("../database/dbHelpers");
const { enqueueTranscriptionJob } = require("../queues/transcriptionQueue");

class LessonController {

    // PONTO CRÍTICO: este método foi reescrito em async/await (usando os
    // helpers de Promise de dbHelpers.js) para poder aguardar o INSERT antes
    // de disparar o job — os outros métodos da classe (delete, update,
    // indexByCourse) continuam com callback, propositalmente intocados,
    // para manter o diff focado só na funcionalidade de legendas.
    static async create(req, res) {

        const {
            title,
            status,
            course_id
        } = req.body;

        // Compatibilidade com o fluxo antigo: continua aceitando video_url
        // já pronto no body (ex: vídeo hospedado externamente). Quando vem
        // um arquivo via multipart (req.file), ele tem prioridade.
        const videoUrlFromBody = req.body.video_url;
        const uploadedVideoPath = req.file?.path;

        const user_id = req.user.id;

        // validações (mantidas como já existiam)
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

        if (
            status !== "draft" &&
            status !== "published"
        ) {

            return res.status(400).json({
                error: "Status inválido"
            });
        }

        try {

            // verifica se curso existe
            const course = await dbGet(
                "SELECT * FROM courses WHERE id = ?",
                [course_id]
            );

            if (!course) {
                return res.status(404).json({
                    error: "Curso não encontrado"
                });
            }

            // verifica dono do curso
            if (Number(course.creator_id) !== Number(user_id)) {
                return res.status(403).json({
                    error: "Sem permissão"
                });
            }

            // video_url salvo no banco: prioriza o arquivo enviado nesta requisição
            const videoUrl = uploadedVideoPath
                ? `/uploads/videos/${path.basename(uploadedVideoPath)}`
                : (videoUrlFromBody || null);

            // cria lesson
            const { lastID: lessonId } = await dbRun(
                `
                INSERT INTO lessons
                (title, status, video_url, course_id)
                VALUES (?, ?, ?, ?)
                `,
                [title, status, videoUrl, course_id]
            );

            // PONTO CRÍTICO (requisito 4): dispara o job em background e NÃO
            // aguarda (sem await na chamada da Promise) — a resposta HTTP
            // volta imediatamente, sem esperar a transcrição. Falha ao
            // enfileirar é só logada; não derruba a criação da aula, que já
            // foi concluída com sucesso.
            if (videoUrl) {
                enqueueTranscriptionJob({
                    lessonId,
                    videoPath: uploadedVideoPath || null,
                    videoUrl: uploadedVideoPath ? null : videoUrl
                }).catch((err) => {
                    console.error(
                        `Erro ao enfileirar transcrição da lesson ${lessonId}:`,
                        err.message
                    );
                });
            }

            return res.status(201).json({
                message: "Lesson criada",
                lessonId,
                subtitleStatus: videoUrl ? "processing" : "none"
            });

        } catch (err) {

            console.error("Erro ao criar lesson:", err.message);

            return res.status(500).json({
                error: "Erro ao criar aula"
            });
        }
    }

    // Endpoint simples para o frontend perguntar "a legenda já ficou pronta?"
    // (polling), já que o processamento é assíncrono e não há webhook aqui.
    static async subtitleStatus(req, res) {

        const { id } = req.params;

        try {

            const lesson = await dbGet(
                `
                SELECT id, subtitle_status, subtitle_url, subtitle_error
                FROM lessons
                WHERE id = ?
                `,
                [id]
            );

            if (!lesson) {
                return res.status(404).json({
                    error: "Lesson não encontrada"
                });
            }

            return res.json(lesson);

        } catch (err) {

            console.error("Erro ao consultar status da legenda:", err.message);

            return res.status(500).json({
                error: "Erro no banco"
            });
        }
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