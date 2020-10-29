var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send({ error: 'not signed in' });
};



module.exports = middlewareObj;