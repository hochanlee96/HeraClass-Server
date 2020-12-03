var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    title: String,
    studioId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Studio"
    },
    category: String,
    date: Date,
    duration: Number,
    trainer: String,
    capacity: Number,
    students: [{ type: String }],
    difficulty: String
});

module.exports = mongoose.model("Event", eventSchema);