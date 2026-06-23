require("dotenv").config();

const fs = require("fs");
const { Worker } = require("bullmq");

const connection = require("../config/redisConnection");
const { TRANSCRIPTION_QUEUE_NAME } = require("./transcriptionQueue");
const { LessonRepository } = require("../repositories/lessonRepository");
const { transcribeToSubtitle, WhisperTranscriptionError } = require("../services/whisperService");
const { saveSubtitleFile } = require("../services/subtitleService");
const { resolveLocalVideoFile } = require("../services/videoSourceService");

const SUBTITLE_FORMAT = "vtt";

/**
 * Processa um job de transcrição:
 *   1. marca a lesson como "processing"
 *   2. resolve o arquivo de vídeo local (upload direto ou download de URL)
 *   3. chama a API Whisper já pedindo o formato .vtt
 *   4. salva o .vtt em disco e grava a URL final na lesson
 *
 * Qualquer falha é registrada em lessons.subtitle_error e o status vira
 * "failed" — o frontend consegue mostrar isso ao usuário em vez de a aula
 * ficar presa em "processing" para sempre.
 */
async function processTranscriptionJob(job) {
    const { lessonId, videoPath, videoUrl } = job.data;

    console.log(`[transcription] Iniciando job da lesson ${lessonId} (tentativa ${job.attemptsMade + 1})`);

    await LessonRepository.markSubtitleProcessing(lessonId);

    let resolvedFile;

    try {
        resolvedFile = await resolveLocalVideoFile({ videoPath, videoUrl });

        const subtitleContent = await transcribeToSubtitle(resolvedFile.filePath, {
            format: SUBTITLE_FORMAT
        });

        const subtitleUrl = saveSubtitleFile(lessonId, subtitleContent, SUBTITLE_FORMAT);

        await LessonRepository.markSubtitleCompleted(lessonId, subtitleUrl);

        console.log(`[transcription] Lesson ${lessonId} concluída: ${subtitleUrl}`);

        return { subtitleUrl };

    } catch (err) {

        const message = err instanceof WhisperTranscriptionError
            ? err.message
            : `Erro inesperado ao processar transcrição: ${err.message}`;

        console.error(`[transcription] Falha na lesson ${lessonId}:`, message);

        await LessonRepository.markSubtitleFailed(lessonId, message);

        // Relança para o BullMQ aplicar a política de retry/backoff configurada
        // na fila (3 tentativas, backoff exponencial). Em cada nova tentativa
        // o status volta para "processing" no início desta função.
        throw err;

    } finally {

        // Remove o arquivo temporário baixado de uma URL externa, se houver.
        // Arquivos enviados por upload (videoPath) NÃO são removidos aqui —
        // eles continuam servindo como o vídeo da aula.
        if (resolvedFile?.isTemporary) {
            fs.unlink(resolvedFile.filePath, () => {});
        }
    }
}

const worker = new Worker(TRANSCRIPTION_QUEUE_NAME, processTranscriptionJob, {
    connection,
    concurrency: 2 // no máx. 2 transcrições simultâneas; ajuste conforme CPU/limites da API
});

worker.on("completed", (job) => {
    console.log(`[transcription] Job ${job.id} finalizado com sucesso`);
});

worker.on("failed", (job, err) => {
    console.error(`[transcription] Job ${job?.id} falhou definitivamente:`, err.message);
});

console.log("Worker de transcrição aguardando jobs...");

module.exports = worker;
