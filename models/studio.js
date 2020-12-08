var mongoose = require("mongoose");

var StudioSchema = new mongoose.Schema({
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
    amenities: [{ type: mongoose.Schema.Types.String }],
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
    ],
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
});

// StudioSchema.index({ title: 'text', bigAddress: 'text', category: 'text' })

module.exports = mongoose.model("Studio", StudioSchema);