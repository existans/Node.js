const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public"));

async function start() {
    await mongoose.connect("mongodb://localhost:27017/studentsDB");

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log("Сервер запущено на порту: " + PORT);
        console.log("http://localhost:" + PORT);
    });
}

start();

app.get("/api/students", async (req, res) => {
    const students = await Student.find();
    res.send(students);
});

app.get("/api/students/:id", async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.send(student);
});

app.post("/api/students", jsonParser, async (req, res) => {
    const student = await Student.create({
        name: req.body.name,
        group: req.body.group,
        grade: req.body.grade
    });
    res.send(student);
});

app.delete("/api/students/:id", async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);
    res.send(student);
});

app.put("/api/students", jsonParser, async (req, res) => {
    const student = await Student.findByIdAndUpdate(
        req.body.id,
        {
            name: req.body.name,
            group: req.body.group,
            grade: req.body.grade
        },
        { new: true }
    );
    res.send(student);
});
