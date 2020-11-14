const express = require('express');
const router = express.Router();

const Studio = require('../../models/studio');
const middleware = require('../../middleware');
const User = require('../../models/user');
const { populate } = require('../../models/studio');

router.get("/search/keyword/:keyword", function (req, res) {
    console.log(req.params.keyword)
    const keyword = req.params.keyword;
    Studio.find({ $text: { $search: keyword } }, function (err, foundStudios) {
        if (err) {
            console.log(err)
        } else {
            console.log('length :', foundStudios.length);
            res.send(foundStudios);
        }
    })
})
router.get("/search/:maxX&:minX&:maxY&:minY", function (req, res) {
    const boundary = req.params;
    console.log(boundary)
    Studio.find({ "coordinates.latitude": { $lte: boundary.maxX, $gte: boundary.minX }, "coordinates.longitude": { $lte: boundary.maxY, $gte: boundary.minY } }).populate("reviews", 'rating').exec((err, searchedStudios) => {
        if (err) {
            console.log(err)
        } else {
            console.log(searchedStudios)
            res.send(searchedStudios);
        }
    })

})

router.get("/favorite", middleware.isLoggedInAsUser, function (req, res) {
    Studio.find({ '_id': { $in: req.user.favorites } }).populate("reviews", 'rating').exec((err, favoriteStudios) => {
        if (err) {
            console.log(err);
        } else {
            res.send(favoriteStudios);
        }
    })

})

router.get("/:studioId", function (req, res) {
    //get params
    console.log('testing: ', req.params.studioId)
    Studio.findById(req.params.studioId).populate("reviews").exec((err, searchedStudio) => {
        if (err) {
            console.log(err);
        } else {
            res.send(searchedStudio);
        }
    })
})


router.put('/update-followers', middleware.isLoggedInAsUser, function (req, res) {
    console.log(req.body)
    if (req.body.add) {
        Studio.findByIdAndUpdate(req.body.studioId, { $push: { followers: req.user.email } }, { safe: true, upsert: true, new: true }, function (err, foundStudio) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundStudio);
                res.status(200).send();
            }
        })
    } else {
        Studio.findByIdAndUpdate(req.body.studioId, { $pull: { followers: req.user.email } }, { safe: true, upsert: true, new: true }, function (err, foundStudio) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundStudio);
                res.status(200).send();
            }
        })
    }
})



module.exports = router;