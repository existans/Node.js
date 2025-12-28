const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const jsonParser = express.json();

const client = new MongoClient("mongodb://localhost:27017/");
let db;

app.use(express.static(__dirname + "/public"));

async function start() {
    await client.connect();
    db = client.db("studentsDB");
    app.locals.collection = db.collection("students");
    app.listen(3000);
    console.log("Сервер запущено: http://localhost:3000");
}

start();

app.get("/api/students", async (req, res) => {
    const students = await req.app.locals.collection.find({}).toArray();
    res.send(students);
});

app.get("/api/students/:id", async (req, res) => {
    const student = await req.app.locals.collection.findOne({ _id: new ObjectId(req.params.id) });
    res.send(student);
});

app.post("/api/students", jsonParser, async (req, res) => {
    const student = {
        name: req.body.name,
        group: req.body.group,
        grade: req.body.grade
    };
    const result = await req.app.locals.collection.insertOne(student);
    student._id = result.insertedId;
    res.send(student);
});

app.delete("/api/students/:id", async (req, res) => {
    const result = await req.app.locals.collection.findOneAndDelete({ _id: new ObjectId(req.params.id) });
    res.send(result?.value ?? null);
});

app.put("/api/students", jsonParser, async (req, res) => {
    const id = new ObjectId(req.body.id);
    const updated = await req.app.locals.collection.findOneAndUpdate(
        { _id: id },
        { $set: { name: req.body.name, group: req.body.group, grade: req.body.grade }},
        { returnDocument: "after" }
    );
    res.send(updated?.value ?? null);
});

process.on("SIGINT", async () => {
    await client.close();
    process.exit();
});
