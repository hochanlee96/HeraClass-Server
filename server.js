var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    // classSaver = require('./classSaver'),
    User = require("./models/user"),
    Partner = require("./models/partner");

mongoose.connect("mongodb://localhost:27017/heraclass", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
// mongoose.connect("mongodb+srv://hochan:lee@cluster0.v5xbw.mongodb.net/yelp_camp?retryWrites=true&w=majority");
// classSaver();
const port = process.env.PORT || 3001;
const cors = require('cors');


const userAuthRoutes = require('./routes/user/auth');
const userClassRoutes = require('./routes/user/class-search');
const reviewRoutes = require('./routes/user/review');
const partnerAuthRoutes = require('./routes/partner/auth');
const partnerClassRoutes = require('./routes/partner/class-search');

const { Strategy } = require('passport');

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

var allowedDomains = ['http://localhost:3000', 'http://localhost:3003']
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

app.use(require("express-session")({
    secret: "HERA_CLASS",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
// passport.use(User.createStrategy());
// passport.use(Partner.createStrategy());
passport.use('user-local', User.createStrategy());
passport.use('partner-local', Partner.createStrategy());
passport.use(new GoogleStrategy({
    clientID: '350520742740-9hml57j4kd3vv74vja6fbp40vj1q7qho.apps.googleusercontent.com',
    clientSecret: '250cWXdXfo9rAE4GKuiDw5DB',
    callbackURL: "http://localhost:3001/user/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        const userEmail = profile.emails[0].value;
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
                    User.findOneAndUpdate({ 'email': userEmail }, { googleId: googleId }, function (err, updatedUser) {
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
                User.create({ email: userEmail, username, googleId }, function (err, user) {
                    if (err) {
                        console.log(err)
                    } else {
                        done(null, user);
                    }
                })
            }
        })
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
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
app.use('/user/class-list', userClassRoutes);
app.use('/user/review', reviewRoutes);
app.use('/partners/auth', partnerAuthRoutes);
app.use('/partners/classes', partnerClassRoutes);


app.listen(port, () => {
    console.log('express is running on port ' + port);
})