var seedData = require('./seed'),
    Class = require('./models/class'),
    mongoose = require("mongoose");

function saveClasses() {
    seedData.forEach(function (seed) {
        console.log(seed)
        Class.create(seed, function (err, savedClass) {
            if (err) {
                console.log(err)
            } else {
                console.log("added class : ", savedClass.title);
            }
        });
    });
}
module.exports = saveClasses;
