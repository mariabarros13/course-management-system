const express = require("express");

const router = express.Router();

const LessonController = require("../controllers/LessonController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/",
    authMiddleware,
    LessonController.create
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