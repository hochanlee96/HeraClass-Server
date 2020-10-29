const express = require('express');
const router = express.Router();
const Class = require('../models/class');
const seedClasses = require('../seed');
const passport = require('passport');
const middleware = require('../middleware');


router.get("/", function (req, res) {
    Class.find({}, (err, searchedClasses) => {
        if (err) {
            console.log(err)
        } else {
            res.send(searchedClasses);
        }
    })

})


router.get("/favorite", middleware.isLoggedIn, function (req, res) {
    const favoriteClasses = req.user.favorites;
    Class.find({ '_id': { $in: favoriteClasses } }, function (err, foundClasses) {
        if (err) {
            console.log(err)
        } else {
            console.log(foundClasses)
            res.send(foundClasses);
        }
    })
})

router.get("/:classId", function (req, res) {
    //get params
    const classId = req.params.classId;
    console.log(classId);
    Class.findById(classId, (err, searchedClass) => {
        if (err) {
            console.log(err);
        } else {
            console.log(searchedClass);
            res.send(searchedClass);
        }
    })
})


router.put('/update-followers', middleware.isLoggedIn, function (req, res) {
    console.log(req.body)
    if (req.body.add) {
        Class.findByIdAndUpdate(req.body.classId, { $push: { followers: req.user.email } }, { safe: true, upsert: true, new: true }, function (err, foundClass) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundClass);
                res.status(200).send();
            }
        })
    } else {
        Class.findByIdAndUpdate(req.body.classId, { $pull: { followers: req.user.email } }, { safe: true, upsert: true, new: true }, function (err, foundClass) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundClass);
                res.status(200).send();
            }
        })
    }
})



module.exports = router;