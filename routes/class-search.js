const express = require('express');
const router = express.Router();
// const passport = require("passport");
// const Users = require("../models/user");
const seedClasses = require('../seed');
const passport = require('passport');


router.get("/", function (req, res) {
    console.log('class', req.isAuthenticated());
    res.send(seedClasses);

})

router.get("/:classId", function (req, res) {
    //get params
    const classId = req.params.classId;
    //fetch the class from db
    const fetchedClass = seedClasses.find(cl => cl.id === classId);

    res.send(fetchedClass)
})



module.exports = router;