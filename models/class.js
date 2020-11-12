var mongoose = require("mongoose");

var classSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    bigAddress: String,
    address: String,
    category: [
        { type: mongoose.Schema.Types.String }
    ],
    details: {
        tel: String
    },
    followers: [
        { type: mongoose.Schema.Types.String }
    ],
    postedBy: String,
    reviews: [
        {
            // id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
            // },
            // rating: Number
        }
    ]
});

module.exports = mongoose.model("Class", classSchema);