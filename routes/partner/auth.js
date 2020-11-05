var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Partner = require("../../models/partner"),
    middleware = require('../../middleware');



router.post("/register", function (req, res) {
    Partner.register(new Partner({ email: req.body.email, username: req.body.username, isPartner: true }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.json({ error: err.message });
        }
        console.log('?')
        passport.authenticate("partner-local")(req, res, function () {
            console.log(req.isAuthenticated());
            console.log(req.user);
            res.redirect('/partners/auth/partner-data');
        });
    });
});

router.post('/login', passport.authenticate('partner-local'), function (req, res) {
    console.log('pass')
    res.redirect('/partners/auth/partner-data')
})

router.get('/partner-data', middleware.isLoggedInAsPartner, function (req, res) {
    console.log('redirected')
    const user_info = {}
    user_info.username = req.user.username;
    user_info.email = req.user.email;
    user_info.expires = req.session.cookie.expires;
    console.log('user :', user_info)
    return res.json(user_info);
})


router.get("/logout", function (req, res) {
    req.logout();
    return res.sendStatus(200);
});


module.exports = router;