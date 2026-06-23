const { dbGet, dbRun } = require("../database/dbHelpers");

const SUBTITLE_STATUS = Object.freeze({
    NONE: "none",           // aula sem vídeo / sem job disparado
    PROCESSING: "processing",
    COMPLETED: "completed",
    FAILED: "failed"
});

class LessonRepository {

    static findById(id) {
        return dbGet("SELECT * FROM lessons WHERE id = ?", [id]);
    }

    static findSubtitleStatus(id) {
        return dbGet(
            "SELECT id, subtitle_status, subtitle_url, subtitle_error FROM lessons WHERE id = ?",
            [id]
        );
    }

    static markSubtitleProcessing(lessonId) {
        return dbRun(
            `UPDATE lessons
             SET subtitle_status = ?, subtitle_error = NULL
             WHERE id = ?`,
            [SUBTITLE_STATUS.PROCESSING, lessonId]
        );
    }

    static markSubtitleCompleted(lessonId, subtitleUrl) {
        return dbRun(
            `UPDATE lessons
             SET subtitle_status = ?, subtitle_url = ?, subtitle_error = NULL
             WHERE id = ?`,
            [SUBTITLE_STATUS.COMPLETED, subtitleUrl, lessonId]
        );
    }

    static markSubtitleFailed(lessonId, errorMessage) {
        return dbRun(
            `UPDATE lessons
             SET subtitle_status = ?, subtitle_error = ?
             WHERE id = ?`,
            [SUBTITLE_STATUS.FAILED, errorMessage, lessonId]
        );
    }
}

module.exports = { LessonRepository, SUBTITLE_STATUS };
