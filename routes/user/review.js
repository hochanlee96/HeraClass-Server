const express = require("express");
const router = express.Router({ mergeParams: true });
const Class = require('../../models/class');
const Review = require('../../models/review');
const middleware = require('../../middleware');
const { Mongoose } = require("mongoose");

//comments routes

router.post("/:classId", middleware.isLoggedInAsUser, function (req, res) {
    Class.findById(req.params.classId, function (err, foundClass) {
        if (err) {
            console.log(err);
        } else {
            Review.create({ ...req.body, author: { email: req.user.email, username: req.user.username }, date: new Date() }, function (err, createdReview) {
                if (err) {
                    console.log(err);
                } else {

                    foundClass.reviews.push(createdReview);
                    foundClass.save();
                    console.log('review successfully saved')
                    res.send({ status: 200 });
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

router.delete("/:classId/:reviewId", middleware.checkReviewOwnership, function (req, res) {
    console.log('params', req.params);
    //merge params -> get classId -> pop from reviews list
    Class.findByIdAndUpdate(req.params.classId, { $pull: { reviews: req.params.reviewId } }, { safe: true, upsert: true, new: true }, function (err, foundClass) {
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