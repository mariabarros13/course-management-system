const fs = require("fs");
const path = require("path");
const { SUBTITLES_DIR } = require("../config/paths");

function ensureSubtitlesDir() {
    fs.mkdirSync(SUBTITLES_DIR, { recursive: true });
}

/**
 * Salva o conteúdo da legenda em disco e retorna a URL pública relativa
 * (servida via express.static em "/uploads") para gravar em lessons.subtitle_url.
 */
function saveSubtitleFile(lessonId, content, format = "vtt") {
    ensureSubtitlesDir();

    const fileName = `lesson-${lessonId}.${format}`;
    const filePath = path.join(SUBTITLES_DIR, fileName);

    fs.writeFileSync(filePath, content, "utf-8");

    return `/uploads/subtitles/${fileName}`;
}

module.exports = { saveSubtitleFile };
