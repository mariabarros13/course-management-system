const express = require("express");

const router = express.Router();

const LessonController = require("../controllers/LessonController");

const authMiddleware = require("../middleware/authMiddleware");
const uploadVideo = require("../middleware/uploadMiddleware");

// PONTO CRÍTICO (requisito 4): uploadVideo.single("video") roda ANTES do
// controller. Se vier multipart/form-data com um campo "video", o multer
// salva o arquivo em disco e popula req.file; se vier application/json
// (fluxo antigo, sem arquivo), o multer simplesmente não faz nada e passa
// para o controller, que cai no fallback de video_url.
router.post(
    "/",
    authMiddleware,
    uploadVideo.single("video"),
    LessonController.create
);

router.get(
    "/:id/subtitle-status",
    authMiddleware,
    LessonController.subtitleStatus
);

router.delete(
    "/:id",
    authMiddleware,
    LessonController.delete
);

router.put(
    "/:id",
    authMiddleware,
    LessonController.update
);

module.exports = router;