const express = require('express');
const router = express.Router();

const middleware = require('../middleware');
const Event = require('../models/event');
const Studio = require('../models/studio');
const User = require('../models/user');


router.get('/enrolled', middleware.isLoggedInAsUser, function (req, res) {
    console.log('last test!!')
    Event.find({ '_id': { $in: req.user.events } }).populate('studioId', "address").exec((err, enrolledEvents) => {
        if (err) {
            console.log(err);
        } else {
            res.send(enrolledEvents);
        }
    })
})

router.post('/new', middleware.isLoggedInAsPartner, function (req, res) {

    Studio.findById(req.body.studioId, function (err, foundStudio) {
        if (err) {
            console.log(err)
        } else {
            Event.create({ ...req.body }, function (err, newEvent) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(newEvent);
                    foundStudio.events.push(newEvent);
                    foundStudio.save();
                    res.status(200).send();
                }
            })
        }
    })
    console.log(req.body);
})

router.put('/cancel', middleware.isLoggedInAsUser, function (req, res) {
    const eventId = req.body.eventId;
    console.log(req.body)
    Event.findByIdAndUpdate(eventId, {
        $pull: { students: req.user.email }
    }, { safe: true, upsert: true, new: true }, function (err, event) {
        if (err) {
            console.log(err)
            res.send({ error: 'Cancel Failed!' })
        } else {
            User.findByIdAndUpdate(req.user._id, { $pull: { events: eventId } }, { safe: true, upsert: true, new: true }, (err, foundUser) => {
                if (err) {
                    res.send({ error: 'Cancel Failed!' })
                } else {
                    Event.find({ '_id': { $in: foundUser.events } }).populate('studioId', "address").exec((err, enrolledEvents) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send(enrolledEvents);
                        }
                    })
                }
            })
        }
    })
})


router.put('/:eventId', middleware.isLoggedInAsUser, function (req, res) {
    if (req.body.join) {
        Event.findById(req.params.eventId, function (err, foundEvent) {
            if (err) {
                console.log(err);
            } else if (foundEvent.students.length < Number(foundEvent.capacity)) {
                foundEvent.students.push(req.user.email);
                foundEvent.save();
                console.log("added student to this event")
                User.findById(req.user._id, function (err, foundUser) {
                    if (err) {
                        console.log(err)
                    } else {
                        foundUser.events.push(req.params.eventId);
                        foundUser.save();
                        console.log("added event to students event list")
                        res.status(200).send({ foundEvent: foundEvent, foundUser: foundUser });
                    }
                })
            } else {
                res.send({ error: 'full' })
            }
        })
    } else {
        Event.findById(req.params.eventId, function (err, foundEvent) {
            if (err) {
                console.log(err);
            } else {
                foundEvent.students.pop(req.user.email);
                foundEvent.save();
                console.log("removed student from this event")
                User.findById(req.user._id, function (err, foundUser) {
                    if (err) {
                        console.log(err)
                    } else {
                        foundUser.events.pop(req.params.eventId);
                        foundUser.save();
                        console.log("removed event from students event list")
                        res.status(200).send();
                    }
                })
            }
        })
    }

})




module.exports = router;