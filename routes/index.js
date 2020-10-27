var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


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
    User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.json({ error: err.message });
        }
        passport.authenticate("local")(req, res, function () {
            console.log(req.isAuthenticated());
            console.log(req.user);
            res.redirect('/user-data');
        });
    });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/user-data')
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

router.get('/user-data', function (req, res) {
    var user_info = null;
    // console.log('req_user', req.user)
    if (!req.user) {
        console.log('session expired')
    } else {
        console.log('req.user one?', req.user)
        user_info = {}
        user_info.username = req.user.username;
        user_info.email = req.user.email;
        user_info.favorites = [...req.user.favorites];
        user_info.expires = req.session.cookie.expires;
        console.log('user!!', user_info)
    }
    return res.json(user_info);
})


router.get("/logout", function (req, res) {
    req.logout();
    res.json('logged out');
});


module.exports = router;