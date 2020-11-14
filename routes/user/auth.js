var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../../models/user"),
    middleware = require('../../middleware');


//Routes
// router.post("/register", function (req, res) {
//     User.register(new User({ username: req.body.username, userId: req.body.userId, favorites: [] }), req.body.password, function (err, user) {
//         if (err) {
//             console.log(err);
//             return res.send({ "error": err.message });
//         }
//         req.login(user, function (err) {
//             if (err) {
//                 res.send({ 'error': err.message })
//             }
//             console.log(req.session)
//             return res.json(req.session)
//         });
//     })
// });
router.post("/register", function (req, res) {
    console.log('registering...')
    console.log('req.body', req.body)
    User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            if (err.message === "A user with the given username is already registered") {
                return res.json({ error: err.message });
            }
        }
        passport.authenticate("user-local", { failureRedirect: '/user/auth/login-fail', failureFlash: true })(req, res, function () {
            res.redirect('/user/auth/user-data');
        });
    });
});

router.put('/update-favorites', middleware.isLoggedInAsUser, function (req, res) {
    console.log(req.body)
    if (req.body.add) {
        User.findByIdAndUpdate(req.user._id, { $push: { favorites: req.body.studioId } }, { safe: true, upsert: true, new: true }, function (err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundUser);
                res.status(200).send();
            }
        })
    } else {
        User.findByIdAndUpdate(req.user._id, { $pull: { favorites: req.body.studioId } }, { safe: true, upsert: true, new: true }, function (err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundUser);
                res.status(200).send();
            }
        })
    }
})

router.post('/login', passport.authenticate('user-local', { failureRedirect: '/user/auth/login-fail', failureFlash: true }), function (req, res) {
    res.redirect('/user/auth/user-data')
})

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));

router.get('/facebook',
    passport.authenticate('facebook', { scope: 'email' }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'user/auth/login-fail' }),
    function (req, res) {
        console.log(req.get('origin'))
        return res.redirect('http://localhost:3000')
    });

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: 'user/auth/login-fail' }),
    function (req, res) {
        console.log(req.get('origin'))
        return res.redirect('http://localhost:3000')
    });

router.get('/login-fail', function (req, res) {
    const errorMessage = req.flash('error')[0]
    return res.send({ error: errorMessage })
})

router.put('/edit', middleware.isLoggedInAsUser, function (req, res) {
    console.log('put request')
    User.findOneAndUpdate({ "email": req.user.email }, { "username": req.body.username }, function (err) {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send;
        }
    })
})

router.get('/user-data', middleware.isLoggedInAsUser, function (req, res) {
    const user_info = {}
    user_info.username = req.user.username;
    user_info.email = req.user.email;
    user_info.favorites = [...req.user.favorites];
    user_info.expires = req.session.cookie.expires;
    console.log('user :', user_info)
    return res.json(user_info);
})


router.get("/logout", function (req, res) {
    req.logout();
    return res.sendStatus(200);
});


module.exports = router;