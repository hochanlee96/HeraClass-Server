const express = require('express');
const router = express.Router();

const Studio = require('../../models/studio');
const middleware = require('../../middleware');
const User = require('../../models/user');
const { populate } = require('../../models/studio');

// router.get("/search/keyword/:keyword", function (req, res) {
//     console.log(req.params.keyword)
//     const keyword = req.params.keyword;
//     Studio.find({ $text: { $search: keyword } }, function (err, foundStudios) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log('length :', foundStudios.length);
//             res.send(foundStudios);
//         }
//     })
//     Studio.find({
//         $or: [{ title: { $regex: keyword, $options: "i" } }, { bigAddress: { $regex: keyword, $options: "i" } }, { category: { $regex: keyword, $options: "i" } }]
//     }, function (err, searchedStudios) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(searchedStudios)
//             console.log(searchedStudios.length);
//             res.send(searchedStudios)
//         }
//     })
// })
///:maxX&:minX&:maxY&:minY
router.get("/search", function (req, res) {
    console.log(req);
    const queryString = req.query;
    const center = queryString.center.split(',')
    const coordDistance = { '1': 0.013, '5': 0.055, '10': 0.09, '20': 0.9 }
    const boundary = {
        maxLat: Number(center[0]) + coordDistance[queryString.maxDistance],
        minLat: Number(center[0]) - coordDistance[queryString.maxDistance],
        maxLng: Number(center[1]) + coordDistance[queryString.maxDistance],
        minLng: Number(center[1]) - coordDistance[queryString.maxDistance],
    }
    let amenities;
    const query = {};
    query.$and = [{ "coordinates.latitude": { $lte: boundary.maxLat, $gte: boundary.minLat }, "coordinates.longitude": { $lte: boundary.maxLng, $gte: boundary.minLng } }]
    if (queryString.amenities) {
        const amenities = queryString.amenities.split(',');
        const amenitiesQuery = { "amenities": { $all: amenities } }
        query.$and = [...query.$and, { ...amenitiesQuery }]
    }
    if (queryString.keyword) {
        query.$and = [...query.$and, { $or: [{ title: { $regex: queryString.keyword, $options: "i" } }, { bigAddress: { $regex: queryString.keyword, $options: "i" } }, { category: { $regex: queryString.keyword, $options: "i" } }] }]
    }
    Studio.find({ ...query }).populate("reviews", 'rating').exec((err, searchedStudios) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(searchedStudios)
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
    Studio.findById(req.params.studioId).populate("reviews").populate('events').exec((err, searchedStudio) => {
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