var seedData = require('./seed'),
    Class = require('./models/class'),
    User = require('./models/user'),
    Partner = require('./models/partner'),
    Review = require('./models/review'),
    mongoose = require("mongoose");

function dropCollections() {
    Class.collection.drop();
    User.collection.drop();
    Partner.collection.drop();
    Review.collection.drop();
}
function saveClasses() {
    seedData.studios.forEach(function (studio) {
        Class.create(studio, function (err, savedStudio) {
            if (err) {
                console.log(err)
            } else {
                console.log("added class : ", savedStudio._id);
                Review.create({ author: { email: 'test@test.com', username: 'tester' }, review: 'first review', rating: '5', date: new Date() }, function (err, createdReview) {
                    if (err) {
                        console.log(err);
                    } else {
                        savedStudio.reviews.push(createdReview);
                        savedStudio.save();
                        console.log('review successfully saved')
                    };
                });
            }
        });
    });
}

function saveUsers() {
    seedData.users.forEach(function (user) {
        User.register({ email: user.email, username: user.username }, user.password, function (err, createdUser) {
            if (err) {
                console.log(err)
            } else {
                console.log('created user : ', createdUser.username)

            }
        })

    })
}

function savePartners() {
    seedData.partners.forEach(function (partner) {
        Partner.register({ email: partner.email, username: partner.username, isPartner: true }, partner.password, function (err, createdPartner) {
            if (err) {
                console.log(err)
            } else {
                console.log('created partner : ', createdPartner.username)
            }
        })
    })
}

function dataInitializer() {
    // mongoose.connection.db.dropCollection('classes', function (err, result) {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log(result);
    //     }
    // })
    dropCollections();
    saveClasses();
    savePartners();
    saveUsers();
}



module.exports = dataInitializer;
