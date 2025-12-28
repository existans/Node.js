const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: String,
    group: String,
    grade: Number
});

module.exports = mongoose.model("Student", StudentSchema);
