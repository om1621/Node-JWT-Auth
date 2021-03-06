const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/auth/login');
            }
            else {
                next();
            }
        })
    }
    else {
        res.redirect('/auth/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.user = null;
                console.log(res.locals.user)
                next();
            }
            else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                console.log(res.locals.user)
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        console.log(res.locals.user)
        next();
    }


}

module.exports = { requireAuth, checkUser };