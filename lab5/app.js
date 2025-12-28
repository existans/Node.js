const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public"));

async function start() {
    const mongoURI = `mongodb://${process.env.MONGO_DB_HOSTNAME}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB}`;

    mongoose.connect(mongoURI)
        .then(() => console.log("MongoDB connected:", mongoURI))
        .catch(err => console.error("MongoDB connection error:", err));

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log("Сервер запущено на порту: " + PORT);
        console.log("http://localhost:" + PORT);
    });
}

start();

app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (err) {
        res.status(500).send("Не вдалося отримати студентів.");
    }
});

app.get("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send("Студента не знайдено.");
        }
        res.send(student);
    } catch (err) {
        res.status(500).send("Не вдалося знайти студента.");
    }
});

app.post("/api/students", jsonParser, async (req, res) => {
    try {
        const student = await Student.create({
            name: req.body.name,
            group: req.body.group,
            grade: req.body.grade
        });
        res.send(student);
    } catch (err) {
        res.status(500).send("Не вдалося додати студента.");
    }
});

app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).send("Студента не знайдено для видалення.");
        }
        res.send(student);
    } catch (err) {
        res.status(500).send("Не вдалося видалити студента.");
    }
});

app.put("/api/students", jsonParser, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.body.id,
            {
                name: req.body.name,
                group: req.body.group,
                grade: req.body.grade
            },
            { new: true }
        );
        if (!student) {
            return res.status(404).send("Студента не знайдено для оновлення.");
        }
        res.send(student);
    } catch (err) {
        res.status(500).send("Не вдалося оновити інформацію про студента.");
    }
});
