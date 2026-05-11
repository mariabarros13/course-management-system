const express = require("express");

const router = express.Router();

const CourseController = require("../controllers/CourseController");

const authMiddleware = require("../middleware/authMiddleware");

const LessonController = require("../controllers/LessonController");
// rota protegida
router.post(
    "/",
    authMiddleware,
    CourseController.create
);

router.get(
    "/",
    authMiddleware,
    CourseController.index
);

router.get(
    "/:id",
    authMiddleware,
    CourseController.show
);

router.put(
    "/:id",
    authMiddleware,
    CourseController.update
);

router.delete(
    "/:id",
    authMiddleware,
    CourseController.delete
);

router.get(
    "/:id/lessons",
    authMiddleware,
    LessonController.indexByCourse
);

module.exports = router;