const fs = require("fs");
const OpenAI = require("openai");

const WHISPER_MODEL = "whisper-1";

// Limite real e fixo da API de transcrição da OpenAI — não é configurável.
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

class WhisperTranscriptionError extends Error {}

function getClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new WhisperTranscriptionError(
            "OPENAI_API_KEY não configurada no ambiente (.env)"
        );
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Envia um arquivo de vídeo/áudio para a API Whisper e retorna o conteúdo
 * já pronto no formato de legenda pedido ("vtt" ou "srt"). A própria API
 * da OpenAI faz a conversão — não precisamos gerar o .vtt manualmente.
 */
async function transcribeToSubtitle(filePath, { format = "vtt" } = {}) {

    const { size } = fs.statSync(filePath);

    if (size > MAX_FILE_SIZE_BYTES) {
        throw new WhisperTranscriptionError(
            `Arquivo de ${(size / 1024 / 1024).toFixed(1)}MB excede o limite de 25MB da API Whisper`
        );
    }

    const client = getClient();

    let response;

    try {
        response = await client.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: WHISPER_MODEL,
            response_format: format
        });
    } catch (err) {
        throw new WhisperTranscriptionError(`Falha na chamada à API Whisper: ${err.message}`);
    }

    // Para response_format "vtt"/"srt"/"text" o SDK retorna a string já pronta.
    // O fallback para `response.text` é só uma defesa extra, caso uma versão
    // futura do SDK volte a envelopar a resposta em objeto.
    const subtitleContent = typeof response === "string" ? response : response?.text;

    if (!subtitleContent) {
        throw new WhisperTranscriptionError("API Whisper retornou conteúdo vazio");
    }

    return subtitleContent;
}

module.exports = { transcribeToSubtitle, WhisperTranscriptionError, MAX_FILE_SIZE_BYTES };
