var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
    author: {
        email: String,
        username: String
    },
    review: String,
    rating: Number,
    date: Date
});

module.exports = mongoose.model("Review", reviewSchema);