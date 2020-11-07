const express = require('express');
const router = express.Router();

const Class = require('../../models/class');
const middleware = require('../../middleware');
const User = require('../../models/user');


router.get("/", function (req, res) {
    Class.find({}, (err, searchedClasses) => {
        if (err) {
            console.log(err)
        } else {
            res.send(searchedClasses);
        }
    })

})

router.get("/favorite", middleware.isLoggedInAsUser, function (req, res) {
    Class.find({ '_id': { $in: req.user.favorites } }, (err, favoriteClasses) => {
        if (err) {
            console.log(err);
        } else {
            res.send(favoriteClasses);
        }
    })

})

router.get("/:classId", function (req, res) {
    //get params
    Class.findById(req.params.classId).populate('reviews').exec((err, searchedClass) => {
        if (err) {
            console.log(err);
        } else {
            console.log(searchedClass);
            res.send(searchedClass);
        }
    })
    // Class.findById(classId, (err, searchedClass) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(searchedClass);
    //         res.send(searchedClass);
    //     }
    // })
})


router.put('/update-followers', middleware.isLoggedInAsUser, function (req, res) {
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