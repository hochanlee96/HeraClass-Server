const Studio = require('../models/studio');
const Review = require('../models/review');

var middlewareObj = {};

middlewareObj.isLoggedInAsUser = function (req, res, next) {
    if (req.isAuthenticated() && !req.user.isPartner) {
        console.log('logged in')
        return next();
    }
    res.send({ error: 'not signed in' });
};

middlewareObj.isLoggedInAsPartner = function (req, res, next) {
    if (req.isAuthenticated() && req.user.isPartner) {
        console.log('logged in')
        return next();
    }
    res.send({ error: 'not signed in' });
};

middlewareObj.checkStudioOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Studio.findById(req.params.studioId, function (err, foundStudio) {
            if (err) {
                res.send({ error: err });
            } else {
                if (foundStudio.postedBy === req.user.email) {
                    next();
                } else {
                    res.send({ error: "not permitted" });
                }
            }
        });
    } else {
        res.send({ error: 'not logged in' });
    }
};
middlewareObj.checkReviewOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Review.findById(req.params.reviewId, function (err, foundReview) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundReview)
                if (foundReview.author.email === req.user.email) {
                    next();
                } else {
                    res.send({ error: "not permitted" });
                }
            }
        });
    } else {
        res.send({ error: 'not signed in' });
    }
}


module.exports = middlewareObj;