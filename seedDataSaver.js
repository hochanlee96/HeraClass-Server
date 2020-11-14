var seedData = require('./seed'),
    Studio = require('./models/studio'),
    User = require('./models/user'),
    Partner = require('./models/partner'),
    Review = require('./models/review'),
    mongoose = require("mongoose");

function dropCollections() {
    Studio.collection.drop();
    User.collection.drop();
    Partner.collection.drop();
    Review.collection.drop();
}
function saveStudios() {
    seedData.studios.forEach(function (studio) {
        Studio.create(studio, function (err, savedStudio) {
            if (err) {
                console.log(err)
            } else {
                console.log("added studio : ", savedStudio._id);
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
    dropCollections();
    saveStudios();
    savePartners();
    saveUsers();
}



module.exports = dataInitializer;
