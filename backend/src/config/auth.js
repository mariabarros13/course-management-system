// Centraliza a leitura do segredo JWT para que authMiddleware e
// AuthController nunca tenham um literal duplicado (e divergente) no código.
//
// Falha rápido (fail-fast) na subida do servidor se a variável não estiver
// definida — é melhor o processo não iniciar do que rodar com um segredo
// previsível/hardcoded.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error(
        "JWT_SECRET não definida no ambiente (.env). Defina uma string longa e aleatória antes de iniciar o servidor."
    );
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
