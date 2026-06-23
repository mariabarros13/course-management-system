const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { VIDEOS_DIR } = require("../config/paths");

fs.mkdirSync(VIDEOS_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set([
    "video/mp4",
    "video/webm",
    "video/quicktime",   // .mov
    "video/x-matroska"   // .mkv
]);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, VIDEOS_DIR);
    },
    filename: (req, file, cb) => {
        // Nome aleatório para evitar colisão/overwrite e não confiar no nome
        // original enviado pelo cliente.
        const uniqueName = crypto.randomUUID();
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueName}${extension}`);
    }
});

function fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        return cb(new Error("Formato de vídeo não suportado. Use mp4, webm, mov ou mkv."));
    }
    cb(null, true);
}

const uploadVideo = multer({
    storage,
    fileFilter,
    limits: {
        // Limite do upload em si. O limite de 25MB exigido pela API Whisper
        // é validado separadamente no worker (whisperService), pois é uma
        // regra da IA, não da rota de upload.
        fileSize: 500 * 1024 * 1024 // 500MB
    }
});

module.exports = uploadVideo;
