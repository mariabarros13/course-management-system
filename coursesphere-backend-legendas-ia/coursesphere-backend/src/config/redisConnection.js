require("dotenv").config();

// Conexão Redis usada tanto pelo producer (transcriptionQueue, dentro da API)
// quanto pelo worker (transcriptionWorker, processo separado).
//
// PONTO CRÍTICO: maxRetriesPerRequest precisa ser `null`. É um requisito do
// BullMQ — sem isso, comandos bloqueantes internos (usados para o worker
// "esperar" por novos jobs) lançam erro depois de algumas tentativas e o
// worker para de processar silenciosamente.
const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null
};

module.exports = connection;
