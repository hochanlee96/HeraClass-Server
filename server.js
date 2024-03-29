var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    flash = require('connect-flash'),
    // LocalStrategy = require("passport-local").Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    dataInitializer = require('./seedDataSaver'),
    User = require("./models/user"),
    Partner = require("./models/partner"),
    randomA = require('randomstring'),
    randomB = require('randomstring');
require('dotenv').config();

console.log('hello world');

mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_CONNECT_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
// mongoose.connect("mongodb+srv://hochan:lee@cluster0.v5xbw.mongodb.net/yelp_camp?retryWrites=true&w=majority");
dataInitializer();
const port = process.env.PORT || 3001;
const cors = require('cors');

const userAuthRoutes = require('./routes/user/auth');
const userStudioRoutes = require('./routes/user/studio-search');
const reviewRoutes = require('./routes/user/review');
const partnerAuthRoutes = require('./routes/partner/auth');
const partnerStudioRoutes = require('./routes/partner/studio-search');
const mapRoutes = require('./routes/map');
const eventRoutes = require('./routes/event');
const smsRoutes = require('./routes/sms');

// const { Strategy } = require('passport');

// var cors = function (req, res, next) {
//     var whitelist = [
//         'http://localhost:3000',
//         'http://localhost:3003',
//     ];
//     var origin = req.headers.origin;
//     if (whitelist.indexOf(origin) > -1) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//     next();
// }
// app.use(cors());

var allowedDomains = [process.env.CLIENT_BASE_URL, process.env.PARTNER_BASE_URL]
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // bypass the requests with no origin (like curl requests, mobile apps, etc )
        if (!origin) return callback(null, true);

        if (allowedDomains.indexOf(origin) === -1) {
            var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },

}));
// app.use(cors({
//     origin: "http://localhost:3000", // server의 url이 아닌, 요청하는 client의 url
//     credentials: true
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60, secure: false },
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 1000 * 60 * 60 })
}));

app.use(passport.initialize());
app.use(passport.session());
// passport.use(User.createStrategy());
// passport.use(Partner.createStrategy());
passport.use('user-local', User.createStrategy());
passport.use('partner-local', Partner.createStrategy());
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_API_CLIENT_ID,
    clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
    callbackURL: process.env.SERVER_BASE_URL + "/user/auth/google/callback",
    profileFields: ['id', 'displayName', 'email']

},
    function (accessToken, refreshToken, profile, done) {
        const userEmail = profile.emails[0].value;
        console.log(profile);
        const username = profile.displayName;
        const googleId = profile.id;
        User.findOne({ 'email': userEmail }, function (err, user) {
            if (err) {
                console.log(err)
            } else if (user) {
                //if google id가 있으면
                if (user.googleId) {
                    done(null, user);
                } else {
                    User.findOneAndUpdate({ 'email': userEmail }, { googleId: googleId, verified: true }, function (err, updatedUser) {
                        if (err) {
                            console.log('error while updating user', err)
                        } else {
                            done(null, updatedUser);
                        }
                    })
                }
                //google id가 없으면
                //update user google id field
            } else {
                User.create({ email: userEmail, username, googleId, verified: true }, function (err, user) {
                    if (err) {
                        console.log(err)
                    } else {
                        done(null, user);
                    }
                })
            }
        })
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_API_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_API_CLIENT_SECRET,
    callbackURL: process.env.SERVER_BASE_URL + "/user/auth/facebook/callback",
    profileFields: ['id', 'emails', 'displayName']
},
    function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        const userEmail = profile.emails[0].value;
        const username = profile.displayName;
        const facebookId = profile.id;
        User.findOne({ 'email': userEmail }, function (err, user) {
            if (err) {
                console.log(err)
            } else if (user) {
                //if facebook id가 있으면
                if (user.facebookId) {
                    done(null, user);
                } else {
                    User.findOneAndUpdate({ 'email': userEmail }, { facebookId: facebookId, verified: true }, function (err, updatedUser) {
                        if (err) {
                            console.log('error while updating user', err)
                        } else {
                            done(null, updatedUser);
                        }
                    })
                }
                //facebook id가 없으면
                //update user facebook id field
            } else {
                User.create({ email: userEmail, username, facebookId, verified: true }, function (err, user) {
                    if (err) {
                        console.log(err)
                    } else {
                        done(null, user);
                    }
                })
            }
        })
    }
));

passport.serializeUser(function (user, done) {
    console.log('user:', user);
    let isPartner = false;
    if (user.isPartner) {
        isPartner = true;
    }
    done(null, { id: user._id, isPartner: isPartner })
})
passport.deserializeUser(function (userObj, done) {
    console.log('deserialize')
    const { id } = userObj
    console.log('is Partner? ', userObj.isPartner)
    if (userObj.isPartner) {
        Partner.findById(id, function (err, user) {
            console.log('user!!: ', user)
            done(err, user);
        })
    } else {
        console.log('user schema')
        User.findById(id, function (err, user) {
            console.log('user!: ', user)
            done(err, user);
        })
    }
})
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// passport.serializeUser(Partner.serializeUser());
// passport.deserializeUser(Partner.deserializeUser());

app.use('/user/auth', userAuthRoutes);
app.use('/user/studio-search', userStudioRoutes);
app.use('/user/review', reviewRoutes);
app.use('/partners/auth', partnerAuthRoutes);
app.use('/partners/studios', partnerStudioRoutes);
app.use('/map', mapRoutes);
app.use('/event', eventRoutes);
app.use('/sms', smsRoutes);


app.listen(port, () => {
    console.log('express is running on port ' + port);
})