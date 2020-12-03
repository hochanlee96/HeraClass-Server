var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../../models/user"),
    middleware = require('../../middleware'),
    transporter = require('../../nodemailer'),
    randomstring = require("randomstring");


router.post("/register", function (req, res) {
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

router.get('/verify', middleware.isLoggedInAsUser, function (req, res) {
    const verificationString = randomstring.generate(30);

    User.findByIdAndUpdate(req.user._id, { verificationString: verificationString, expires: new Date(new Date().getTime() + 60000 * 5) }, function (err, user) {
        if (err) {
            res.send({ error: 'error has occured' })
        } else {
            const verificationUrl = `http://localhost:3001/user/auth/verify/${verificationString}`
            let mailOptions = {
                from: 'heraclass.tester@gmail.com',
                // to: req.user.email,
                to: 'j65hcl@gmail.com',
                subject: 'Testing and testing',
                html: `<p>Verify Your Email!</p><a href=${verificationUrl}>Click Here</a>`
            }
            transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('email sent')
                    res.send({ message: 'email sent' })
                }
            })
        }
    })

})

router.get('/verify/:verificationstring', middleware.isLoggedInAsUser, function (req, res) {
    if (req.user.verificationString === req.params.verificationstring && new Date < req.user.expires) {
        User.findByIdAndUpdate(req.user._id, { verified: true }, (err, user) => {
            console.log('user?', user)
            res.redirect('http://localhost:3000/profile')
        })
    } else {
        res.redirect('http://localhost:3000/profile')
    }
})

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
    passport.authenticate('google', { failureRedirect: '/user/auth/login-fail' }),
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

router.get('/check-verification', middleware.isLoggedInAsUser, function (req, res) {
    if (req.user.verified) {
        res.json({ verified: true })
    } else {
        res.json({ verified: false })
    }
})

router.get('/user-data', middleware.isLoggedInAsUser, function (req, res) {
    const user_info = {}
    user_info.username = req.user.username;
    user_info.email = req.user.email;
    user_info.verified = req.user.verified;
    user_info.favorites = [...req.user.favorites];
    user_info.events = [...req.user.events];
    user_info.expires = req.session.cookie.expires;
    console.log('user :', user_info)
    console.log('session', req.user)
    return res.json(user_info);
})


router.get("/logout", function (req, res) {
    req.logout();
    return res.sendStatus(200);
});


module.exports = router;