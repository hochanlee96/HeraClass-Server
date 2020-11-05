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
    User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.json({ error: err.message });
        }
        passport.authenticate("user-local")(req, res, function () {
            console.log(req.isAuthenticated());
            console.log(req.user);
            res.redirect('/user/auth/user-data');
        });
    });
});

router.put('/update-favorites', middleware.isLoggedInAsUser, function (req, res) {
    console.log(req.body)
    if (req.body.add) {
        User.findByIdAndUpdate(req.user._id, { $push: { favorites: req.body.classId } }, { safe: true, upsert: true, new: true }, function (err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundUser);
                res.status(200).send();
            }
        })
    } else {
        User.findByIdAndUpdate(req.user._id, { $pull: { favorites: req.body.classId } }, { safe: true, upsert: true, new: true }, function (err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundUser);
                res.status(200).send();
            }
        })
    }
})

router.post('/login', passport.authenticate('user-local'), function (req, res) {
    res.redirect('/user/auth/user-data')
})

// router.post('/login', function (req, res, next) {
//     passport.authenticate('local', function (err, user, info) {
//         if (err) { return res.send({ 'error': err.message }) }
//         if (user) { // 로그인 성공
//             // console.log(user);
//             // customCallback 사용시 req.logIn()메서드 필수
//             console.log('session 1', req.session)
//             req.logIn(user, function (err) {
//                 console.log('user', user)
//                 console.log('session 2', req.session)
//                 if (err) { return next(err); }
//                 console.log('logged in ', req.isAuthenticated());
//                 // req.logout()
//                 // console.log('logged out', req.isAuthenticated());
//                 return res.redirect('/');
//             });

//         } else {	// 로그인 실패
//             res.send({ 'error': 'login fail' });
//         }
//     })(req, res, next);
// });

router.put('/edit', middleware.isLoggedInAsUser, function (req, res) {
    console.log('put request')
    User.findOneAndUpdate({ "email": req.user.email }, { "username": req.body.username }, function (err) {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send();
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