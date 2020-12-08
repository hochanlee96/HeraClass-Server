const { session } = require("passport");

var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../../models/user"),
    middleware = require('../../middleware'),
    transporter = require('../../nodemailer'),
    randomstring = require("randomstring"),
    fetch = require('node-fetch'),
    CryptoJS = require('crypto-js');;


router.post("/register", function (req, res) {
    User.register(new User({ email: req.body.email, username: req.body.username, phoneNumber: req.body.phoneNumber }), req.body.password, function (err, user) {
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

router.post('/check-verification-number', function (req, res) {
    if (req.session.verificationNumber === req.body.verificationNumber) {
        delete req.session.verificationNumber;
        res.send({ message: 'success' })
    } else {
        res.send({ error: 'verification number wrong' })
    }
})

router.post('/verify-phone', function (req, res) {
    User.findOne({ phoneNumber: req.body.phoneNumber }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                res.send({ error: 'exists' })
            } else {
                const space = " ";
                const newLine = "\n";
                const method = "POST";
                const url = "/sms/v2/services/ncp:sms:kr:260838663750:heraclass/messages";
                const timestamp = Date.now().toString();
                const accessKey = "1F3CEFD02EB39173D187";
                const secretKey = "04D3A9A2DC9C417A16C3119C8ACBA621C3446B6D";
                const verificationNumber = randomstring.generate({ length: 6, charset: 'numeric' });

                req.session.verificationNumber = verificationNumber;

                var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
                hmac.update(method);
                hmac.update(space);
                hmac.update(url);
                hmac.update(newLine);
                hmac.update(timestamp);
                hmac.update(newLine);
                hmac.update(accessKey);

                var hash = hmac.finalize();
                var signature = hash.toString(CryptoJS.enc.Base64);

                fetch("https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:260838663750:heraclass/messages", {
                    method: 'POST',
                    headers: {
                        'x-ncp-apigw-signature-v2': signature,
                        'x-ncp-apigw-timestamp': timestamp,
                        'x-ncp-iam-access-key': '1F3CEFD02EB39173D187',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify({
                        "type": "SMS",
                        "from": "01063905146",
                        "content": `${verificationNumber}`,
                        "messages": [
                            {
                                "to": req.body.phoneNumber
                            }
                        ],
                    })
                }).then(response => {
                    response.json().then(data => res.send(data))
                }).catch(err => {
                    console.log(err)
                    res.send({ error: 'error occured while fetching address' })
                })
            }
        }
    })
})

router.post('/find/id', function (req, res) {
    User.findOne({ username: req.body.username, phoneNumber: req.body.phoneNumber }, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else if (foundUser) {
            console.log(foundUser);
            const space = " ";
            const newLine = "\n";
            const method = "POST";
            const url = "/sms/v2/services/ncp:sms:kr:260838663750:heraclass/messages";
            const timestamp = Date.now().toString();
            const accessKey = "1F3CEFD02EB39173D187";
            const secretKey = "04D3A9A2DC9C417A16C3119C8ACBA621C3446B6D";

            var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
            hmac.update(method);
            hmac.update(space);
            hmac.update(url);
            hmac.update(newLine);
            hmac.update(timestamp);
            hmac.update(newLine);
            hmac.update(accessKey);

            var hash = hmac.finalize();
            var signature = hash.toString(CryptoJS.enc.Base64);

            fetch("https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:260838663750:heraclass/messages", {
                method: 'POST',
                headers: {
                    'x-ncp-apigw-signature-v2': signature,
                    'x-ncp-apigw-timestamp': timestamp,
                    'x-ncp-iam-access-key': '1F3CEFD02EB39173D187',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    "type": "SMS",
                    "from": "01063905146",
                    "content": `Your Email is : ${foundUser.email}`,
                    "messages": [
                        {
                            "to": req.body.phoneNumber
                        }
                    ],
                })
            }).then(response => {
                response.json().then(data => res.send(data))
            }).catch(err => {
                console.log(err)
                res.send({ error: 'error occured while fetching address' })
            })
        } else {
            res.send({ error: "doesn't exist" })
        }
    })
})

router.post('/find/password/send-verification', function (req, res) {
    User.findOne({ email: req.body.email, username: req.body.username }, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.send({ error: err })
        } else if (foundUser) {
            const verificationNumber = randomstring.generate({ length: 6, charset: 'numeric' });
            req.session.verification = { verificationNumber: verificationNumber, id: foundUser._id };
            if (req.emailMethod) {
                let mailOptions = {
                    from: 'heraclass.tester@gmail.com',
                    // to: foundUser.email,
                    to: 'j65hcl@gmail.com',
                    subject: '비밀번호 찾기 인증번호',
                    html: `<p>비밀번호 찾기 인증번호입니다</p><p>${verificationNumber}</p>`
                }
                transporter.sendMail(mailOptions, function (err, data) {
                    if (err) {
                        console.log(err)
                        res.send({ error: err })
                    } else {
                        console.log('email sent')
                        res.send({ message: 'success' })
                    }
                })
            } else {
                //휴대폰인증
                const space = " ";
                const newLine = "\n";
                const method = "POST";
                const url = "/sms/v2/services/ncp:sms:kr:260838663750:heraclass/messages";
                const timestamp = Date.now().toString();
                const accessKey = "1F3CEFD02EB39173D187";
                const secretKey = "04D3A9A2DC9C417A16C3119C8ACBA621C3446B6D";

                var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
                hmac.update(method);
                hmac.update(space);
                hmac.update(url);
                hmac.update(newLine);
                hmac.update(timestamp);
                hmac.update(newLine);
                hmac.update(accessKey);

                var hash = hmac.finalize();
                var signature = hash.toString(CryptoJS.enc.Base64);

                fetch("https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:260838663750:heraclass/messages", {
                    method: 'POST',
                    headers: {
                        'x-ncp-apigw-signature-v2': signature,
                        'x-ncp-apigw-timestamp': timestamp,
                        'x-ncp-iam-access-key': '1F3CEFD02EB39173D187',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify({
                        "type": "SMS",
                        "from": "01063905146",
                        "content": `인증번호는 : [${verificationNumber}] 입니다`,
                        "messages": [
                            {
                                "to": foundUser.phoneNumber
                            }
                        ],
                    })
                }).then(response => {
                    response.json().then(data => res.send(data))
                }).catch(err => {
                    console.log(err)
                    res.send({ error: 'error occured while fetching address' })
                })
            }
        } else {
            res.send({ error: "doesn't exist" })
        }
    })
})

router.post('/find/password/reset-password', function (req, res) {
    if (req.session.verification.verificationNumber === req.body.verificationNumber) {
        console.log('workd')
        User.findById(req.session.verification.id, function (err, foundUser) {
            foundUser.setPassword(req.body.newPassword, function () {
                delete session.verification;
                foundUser.save();
                res.send({ message: 'success' });
            })
        })
    } else {
        res.send({ error: "인증번호가 틀렸습니다" })
    }
})



router.post('/password-reset', passport.authenticate('user-local', { failureRedirect: '/user/auth/login-fail', failureFlash: true }), function (req, res) {
    //reset password query here!!
    User.findById(req.user._id, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.send({ error: 'error occured!' })
        } else {
            foundUser.setPassword(req.body.newPassword, function () {
                foundUser.save();
                res.status(200).json({ message: 'success' });
            });
        }
    })
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
    if (req.user.googleId || req.user.facebookId) {
        user_info.social = true;
    } else {
        user_info.social = false;
    }
    console.log('user :', user_info)
    console.log('session user', req.user)
    console.log('session', req.session);
    return res.json(user_info);
})


router.get("/logout", function (req, res) {
    req.logout();
    return res.sendStatus(200);
});


module.exports = router;