var mongoose = require("mongoose");

var classSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    coordinates: {
        latitude: String,
        longitude: String
    },
    address: String,
    category: [
        { type: mongoose.Schema.Types.String }
    ],
    details: {
        tel: String
    },
    followers: [
        { type: mongoose.Schema.Types.String }
    ]
});

module.exports = mongoose.model("Class", classSchema);