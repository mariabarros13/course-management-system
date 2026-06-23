const { Queue } = require("bullmq");
const connection = require("../config/redisConnection");

const TRANSCRIPTION_QUEUE_NAME = "transcription";

const transcriptionQueue = new Queue(TRANSCRIPTION_QUEUE_NAME, {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 }, // 5s, 10s, 20s entre tentativas
        removeOnComplete: { age: 3600 }, // limpa jobs concluídos após 1h (evita o Redis crescer indefinidamente)
        removeOnFail: false // mantém jobs com falha para inspeção manual / retry futuro
    }
});

/**
 * Enfileira um job de transcrição. Retorna quase instantaneamente — quem
 * chama esta função (o controller) NÃO espera a IA responder.
 *
 * Aceita videoPath (arquivo salvo localmente por este upload) OU videoUrl
 * (vídeo já hospedado externamente, fluxo antigo do sistema). O worker decide
 * como obter o arquivo a partir do que for enviado.
 */
async function enqueueTranscriptionJob({ lessonId, videoPath, videoUrl }) {
    if (!videoPath && !videoUrl) {
        throw new Error("É necessário informar videoPath ou videoUrl para enfileirar a transcrição");
    }

    return transcriptionQueue.add("transcribe-lesson", {
        lessonId,
        videoPath: videoPath || null,
        videoUrl: videoUrl || null
    });
}

module.exports = {
    transcriptionQueue,
    enqueueTranscriptionJob,
    TRANSCRIPTION_QUEUE_NAME
};
