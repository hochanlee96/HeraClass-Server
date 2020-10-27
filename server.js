var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    //  methodOverride = require("method-override"),
    User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/heraclass", { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect("mongodb+srv://hochan:lee@cluster0.v5xbw.mongodb.net/yelp_camp?retryWrites=true&w=majority");
const port = process.env.PORT || 3001;
const cors = require('cors');


const indexRoutes = require('./routes/index');
const classRoutes = require('./routes/class-search');


app.use(cors({
    origin: "http://localhost:3000", // server의 url이 아닌, 요청하는 client의 url
    credentials: true
}));

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
passport.use(User.createStrategy());
// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.serializeUser(function (user, done) {
//     console.log('serialize', user)
//     done(null, user.username)
// });
// passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
//     console.log('deserialize', user);
//     User.findOne({ email: user }, function (err, user) {
//         console.log('user', user)
//         done(null, user); // 여기의 user가 req.user가 됨
//     })
// });

// app.use(function (req, res, next) {
//     console.log('req session', req.body)
//     // console.log('req passport', req.body.passport)
//     res.locals.currentUser = req.user;
//     next();
// });

app.use(indexRoutes);
app.use('/class-list', classRoutes);


app.listen(port, () => {
    console.log('express is running on port ' + port);
})