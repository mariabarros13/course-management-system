const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

/**
 * Garante que o worker tenha um arquivo local para enviar ao Whisper:
 * - se o job já trouxe um caminho local (videoPath, vindo do upload via multer),
 *   usa esse arquivo direto;
 * - se trouxe apenas uma URL externa (videoUrl — fluxo antigo, vídeo já hospedado
 *   em outro lugar), faz o download para um arquivo temporário antes de processar.
 *
 * Retorna isTemporary para o worker saber se deve apagar o arquivo depois.
 */
async function resolveLocalVideoFile({ videoPath, videoUrl }) {

    if (videoPath) {
        if (!fs.existsSync(videoPath)) {
            throw new Error(`Arquivo de vídeo não encontrado: ${videoPath}`);
        }
        return { filePath: videoPath, isTemporary: false };
    }

    if (!videoUrl) {
        throw new Error("Job sem videoPath ou videoUrl");
    }

    const response = await fetch(videoUrl);

    if (!response.ok) {
        throw new Error(`Falha ao baixar vídeo de ${videoUrl} (HTTP ${response.status})`);
    }

    const tempFilePath = path.join(os.tmpdir(), `lesson-video-${crypto.randomUUID()}`);
    const buffer = Buffer.from(await response.arrayBuffer());

    fs.writeFileSync(tempFilePath, buffer);

    return { filePath: tempFilePath, isTemporary: true };
}

module.exports = { resolveLocalVideoFile };
