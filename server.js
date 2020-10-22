const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const cors = require('cors');

// const mongoose = require("mongoose");
// const passport = require("passport");?\
// const LocalStrategy = require("passport-local");

// const Campground = require("./models/place");
// const Comment = require("./models/comment");
// const User = require("./models/user");

const indexRoutes = require('./routes/index');
const classRoutes = require('./routes/class-search');
// const homeRoutes = require('./routes/home');
// const commentRoutes = require('./routes/comments');
// const seedDB = require('./seed');



app.use(cors());

app.use(bodyParser.json());
// app.use('/home', homeRoutes);
// app.use("/home/:id/comments", commentRoutes);
app.use('/class-list', classRoutes);
app.use('/', indexRoutes);

// mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
// seedDB();

app.use(bodyParser.urlencoded({ extended: true }));

// app.use(require("express-session")({
//     secret: "PLACEAPP",
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use(function(req, res, next){
//     res.locals.currentUser = req.user;
//     next();
// });



app.listen(port, () => {
    console.log('express is running on port ' + port);
})