var mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    favorites: [
        {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Comment"
            type: String
        }
    ]
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email', passwordField: 'password' });

module.exports = mongoose.model("User", UserSchema);