var mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");

var PartnerSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    isPartner: Boolean
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

PartnerSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("Partner", PartnerSchema);