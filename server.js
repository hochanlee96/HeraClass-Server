var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
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
    }
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
    console.log(userObj.isPartner)
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