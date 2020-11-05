var mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");

var PartnerSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    isPartner: Boolean
});

PartnerSchema.plugin(passportLocalMongoose, { usernameField: 'email', passwordField: 'password' });

module.exports = mongoose.model("Partner", PartnerSchema);