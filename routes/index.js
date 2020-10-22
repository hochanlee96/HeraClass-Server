const express = require('express');
const router = express.Router();
// const passport = require("passport");
// const Users = require("../models/user");

// let user = {email: 'test@test.com', password: 'a'};

// router.get("/register", function(req, res){
//     res.render("register");
// });

// router.post("/register", (req, res) => {
//     Users.findOne({ email: req.body.email }, (err, foundUser) => {
//         if(err){
//             res.json({error: "Something went wrong!"});
//         } else{
//             if(foundUser){
//                 res.json({error: "The user with this email already exists!"});
//             }else{
//                 Users.create(req.body, (err, user) => {
//                     if(err){
//                         res.json({error: err});
//                     } else{
//                         console.log('user created');
//                         res.json({userId: user._id, username: user.username, email: user.email, expirationDate: new Date().getTime() + 3600000});
//                     }
//                 })
//             }
//         }
//     });
// }); 

// router.get("/login", function(req, res){
//     res.json({error:'Fail'});
// });

// router.post("/login", passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login"
// }), function(req, res){
// });

// router.post("/login", (req,res) => {
//     if(user.email === req.body.email && user.password === req.body.password){
//         // res.data.email = req.body.email;
//         // res.data.password = req.body.password;
//         // res.redirect('/');
//         res.json({...req.body, error: null});
//     } else{
//         res.redirect('/login');
//     } 
//     res.redirect('/home');
// });

// router.post("/login", (req,res) => {
//     console.log(req.body)
//     Users.findOne({email: req.body.email}, (err, foundUser) => {
//         if(!foundUser || err){
//             res.json({error: "User does not exist"});
//         } else if(foundUser.password === req.body.password){
//             res.json({userId: foundUser._id, email: foundUser.email, username: foundUser.username, expirationDate: new Date().getTime() + 3600000, error: null});
//         } else{
//             res.json({error: "Password Incorrect"});
//         }
//     })
// });


// router.get("/logout", function(req, res){
//     req.logout();
//     // req.flash("success", "logged you out");
//     res.redirect("/home");
// });

router.get("/bye", function (req, res) {
    var object = { "a": "b" }
    res.send(object);
})

router.get("/", function (req, res) {
    res.send('Hello World!!!!!!');
})




module.exports = router;