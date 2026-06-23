require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./database/db");

const { UPLOADS_ROOT } = require("./config/paths");

const authRoutes = require("./routes/authRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const courseRoutes = require("./routes/courseRoutes");

const lessonRoutes = require("./routes/lessonRoutes");

require("./database/init");

const app = express();


app.use(cors());
app.use(express.json());

// Serve os vídeos enviados e as legendas geradas
// (ex: GET /uploads/subtitles/lesson-1.vtt)
app.use("/uploads", express.static(UPLOADS_ROOT));

app.use("/auth", authRoutes);

app.use("/courses", courseRoutes);

app.use("/lessons", lessonRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API funcionando" });
});

app.get("/profile", authMiddleware, (req, res) => {

    return res.json({
        message: "Rota protegida",
        user: req.user
    });

});

// Error handler genérico — captura, por exemplo, falhas do multer
// (arquivo grande demais, formato de vídeo inválido) lançadas antes do
// controller, e qualquer outro erro síncrono não tratado nas rotas.
app.use((err, req, res, next) => {
    console.error("Erro não tratado:", err.message);
    return res.status(400).json({ error: err.message || "Erro inesperado" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});