const db = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/auth");

class AuthController {

    static register(req, res) {

        const { name, email, password } = req.body;

        // validações básicas
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Senha deve ter pelo menos 6 caracteres"
            });
        }

        // verifica se email já existe
        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, user) => {

                if (err) {
                    return res.status(500).json({
                        error: "Erro no banco"
                    });
                }

                if (user) {
                    return res.status(400).json({
                        error: "Email já cadastrado"
                    });
                }

                // criptografa senha
                const hashedPassword = await bcrypt.hash(password, 10);

                // salva usuário
                db.run(
                    `
                    INSERT INTO users (name, email, password)
                    VALUES (?, ?, ?)
                    `,
                    [name, email, hashedPassword],
                    function(err) {

                        if (err) {
                            return res.status(500).json({
                                error: "Erro ao criar usuário"
                            });
                        }

                        return res.status(201).json({
                            message: "Usuário criado com sucesso",
                            userId: this.lastID
                        });
                    }
                );
            }
        );
    }

    static login(req, res) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email e senha obrigatórios"
        });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {

            if (err) {
                return res.status(500).json({
                    error: "Erro no banco"
                });
            }

            if (!user) {
                return res.status(400).json({
                    error: "Usuário não encontrado"
                });
            }

            // compara senha digitada com senha criptografada
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(400).json({
                    error: "Senha inválida"
                });
            }

            // gera token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                JWT_SECRET,
                {
                    expiresIn: JWT_EXPIRES_IN
                }
            );

            return res.json({
                message: "Login realizado",
                token,

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    );
}
}

module.exports = AuthController;