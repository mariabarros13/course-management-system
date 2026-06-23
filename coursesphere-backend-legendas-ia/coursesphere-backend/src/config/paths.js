const path = require("path");

// Pasta única de uploads na raiz do backend (coursesphere-backend/uploads/...).
// Centralizado aqui para que server.js (static), uploadMiddleware (multer)
// e subtitleService (escrita do .vtt) sempre apontem para o mesmo lugar.
const UPLOADS_ROOT = path.resolve(__dirname, "../../uploads");
const VIDEOS_DIR = path.join(UPLOADS_ROOT, "videos");
const SUBTITLES_DIR = path.join(UPLOADS_ROOT, "subtitles");

module.exports = { UPLOADS_ROOT, VIDEOS_DIR, SUBTITLES_DIR };
