const express = require("express");
const cors = require("cors");

const db = require("./database/db");

const authRoutes = require("./routes/authRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const courseRoutes = require("./routes/courseRoutes");

const lessonRoutes = require("./routes/lessonRoutes");

require("./database/init");

const app = express();


app.use(cors());
app.use(express.json());

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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});