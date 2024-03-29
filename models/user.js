var mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: String,
    verified: Boolean,
    verificationString: String,
    expires: Date,
    username: String,
    password: String,
    phoneNumber: String,
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Studio"
        }
    ],
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ],
    googleId: String,
    facebookId: String,
});

var options = {
    usernameField: 'email',
    passwordField: 'password',
    errorMessages: {
        AttemptTooSoonError: 'Account is currently locked. Try again later',
        TooManyAttemptsError: 'Account locked due to too many failed login attempts',
        NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
        IncorrectPasswordError: 'Password is incorrect',
        IncorrectUsernameError: 'Entered email does not exist',
        UserExistsError: 'A user with the given username is already registered'
    }
}

UserSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User", UserSchema);