const express = require('express');
const router = express.Router();

const Studio = require('../../models/studio');
const middleware = require('../../middleware');
const { search } = require('../user/auth');

router.post('/', middleware.isLoggedInAsPartner, function (req, res) {
    Studio.create({ ...req.body, postedBy: req.user.email }, function (err, newStudio) {
        if (err) {
            console.log(err);
            res.send({ error: err })
        }
        console.log('newStudio', newStudio);
        res.send({ studioId: newStudio._id })
    })

})


router.get('/my-studios', middleware.isLoggedInAsPartner, function (req, res) {
    Studio.find({ "postedBy": req.user.email }, function (err, foundStudios) {
        res.json(foundStudios);
    })
})

router.get("/:studioId", middleware.isLoggedInAsPartner, function (req, res) {
    //get params
    const studioId = req.params.studioId;
    console.log('entered route')
    Studio.findById(studioId, (err, searchedStudio) => {
        if (err) {
            console.log(err);
        } else {
            console.log(searchedStudio);
            if (searchedStudio.postedBy !== req.user.email) {
                res.send({ error: 'You are not permitted to view this!' })
            }
            res.send(searchedStudio);
        }
    })
})

router.put("/:studioId", middleware.checkStudioOwnership, function (req, res) {
    //get params
    const studioId = req.params.studioId;
    Studio.findByIdAndUpdate(studioId, req.body, (err, searchedStudio) => {
        if (err) {
            console.log(err);
        } else {
            console.log(searchedStudio);
            res.status(200).send();
        }
    })
})

router.delete("/:studioId", middleware.checkStudioOwnership, function (req, res) {
    //get params
    const studioId = req.params.studioId;
    Studio.findByIdAndDelete(studioId, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ status: 200 });
        }
    })
})


module.exports = router;