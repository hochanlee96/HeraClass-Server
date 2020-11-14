const express = require("express");
const router = express.Router({ mergeParams: true });
const Studio = require('../../models/studio');
const Review = require('../../models/review');
const middleware = require('../../middleware');
const { Mongoose } = require("mongoose");

//comments routes

router.post("/:studioId", middleware.isLoggedInAsUser, function (req, res) {
    Studio.findById(req.params.studioId, function (err, foundStudio) {
        if (err) {
            console.log(err);
        } else {
            Review.create({ ...req.body, author: { email: req.user.email, username: req.user.username }, date: new Date() }, function (err, createdReview) {
                if (err) {
                    console.log(err);
                } else {

                    foundStudio.reviews.push(createdReview);
                    foundStudio.save();
                    console.log('review successfully saved')
                    res.send(createdReview);
                };
            });
        }
    });
});

// router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
//     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
//         if(err){
//             res.redirect("back");
//         } else{
//             res.redirect("/campgrounds/" + req.params.id);
//         }
//     });
// });

router.put("/:reviewId", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndUpdate(req.params.reviewId, { ...req.body }, function (err, updatedReview) {
        if (err) {
            console.log(err);
        } else {
            console.log('update successful')
            res.send(updatedReview);
        }

    })
})

router.delete("/:studioId/:reviewId", middleware.checkReviewOwnership, function (req, res) {
    console.log('params', req.params);
    //merge params -> get classId -> pop from reviews list
    Studio.findByIdAndUpdate(req.params.studioId, { $pull: { reviews: req.params.reviewId } }, { safe: true, upsert: true, new: true }, function (err, foundStudio) {
        if (err) {
            console.log(err)
        }
        Review.findByIdAndRemove(req.params.reviewId, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send({ status: 200 })
            }
        })
    })
});



module.exports = router;