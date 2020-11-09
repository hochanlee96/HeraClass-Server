const express = require('express');
const router = express.Router();
const passport = require('passport');

const Class = require('../../models/class');
const middleware = require('../../middleware');

router.post('/', middleware.isLoggedInAsPartner, function (req, res) {
    Class.create({ ...req.body, postedBy: req.user.email }, function (err, newClass) {
        if (err) {
            console.log(err);
            res.send({ error: err })
        }
        console.log('newclass', newClass);
        res.send({ classId: newClass._id })
    })

})


router.get('/my-classes', middleware.isLoggedInAsPartner, function (req, res) {
    Class.find({ "postedBy": req.user.email }, function (err, foundClasses) {
        res.json(foundClasses);
    })
})

router.get("/:classId", middleware.isLoggedInAsPartner, function (req, res) {
    //get params
    const classId = req.params.classId;
    console.log('entered route')
    Class.findById(classId, (err, searchedClass) => {
        if (err) {
            console.log(err);
        } else {
            console.log(searchedClass);
            if (searchedClass.postedBy !== req.user.email) {
                res.send({ error: 'You are not permitted to view this!' })
            }
            res.send(searchedClass);
        }
    })
})

router.put("/:classId", middleware.checkClassOwnership, function (req, res) {
    //get params
    const classId = req.params.classId;
    Class.findByIdAndUpdate(classId, req.body, (err, searchedClass) => {
        if (err) {
            console.log(err);
        } else {
            console.log(searchedClass);
            res.status(200).send();
        }
    })
})

router.delete("/:classId", middleware.checkClassOwnership, function (req, res) {
    //get params
    const classId = req.params.classId;
    Class.findByIdAndDelete(classId, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ status: 200 });
        }
    })
})

// router.get("/", function (req, res) {
//     Class.find({}, (err, searchedClasses) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.send(searchedClasses);
//         }
//     })

// })


// router.get("/favorite", middleware.isLoggedIn, function (req, res) {
//     const favoriteClasses = req.user.favorites;
//     Class.find({ '_id': { $in: favoriteClasses } }, function (err, foundClasses) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(foundClasses)
//             res.send(foundClasses);
//         }
//     })
// })

// router.get("/:classId", function (req, res) {
//     //get params
//     const classId = req.params.classId;
//     console.log(classId);
//     Class.findById(classId, (err, searchedClass) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(searchedClass);
//             res.send(searchedClass);
//         }
//     })
// })


// router.put('/update-followers', middleware.isLoggedIn, function (req, res) {
//     console.log(req.body)
//     if (req.body.add) {
//         Class.findByIdAndUpdate(req.body.classId, { $push: { followers: req.user.email } }, { safe: true, upsert: true, new: true }, function (err, foundClass) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(foundClass);
//                 res.status(200).send();
//             }
//         })
//     } else {
//         Class.findByIdAndUpdate(req.body.classId, { $pull: { followers: req.user.email } }, { safe: true, upsert: true, new: true }, function (err, foundClass) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(foundClass);
//                 res.status(200).send();
//             }
//         })
//     }
// })



module.exports = router;