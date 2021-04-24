const User = require('../models/user');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    let errors = {
        email: "",
        password: "",
    }

    // incorrect email in case of login
    if (err === 'incorrect email') {
        errors.email = 'email is not registered';
        return errors;
    }

    // incorrect password in case of login
    if (err === 'incorrect password') {
        errors.password = 'password is invalid';
        return errors;
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = "Email already registered";
        return errors;
    }

    // signup validations
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }

    return errors;
}

const expiryTime = 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: expiryTime,
    })
}

const signup_get = (req, res) => {
    res.render('signup');
}

const login_get = (req, res) => {
    res.render('login');
}

const signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: expiryTime * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        let errors = handleErrors(err);
        res.status(400).json(errors);
    }
}

const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: expiryTime * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        let errors = handleErrors(err);
        res.status(400).json(errors);
    }
}

const logout = (req, res) => {

    res.cookie('jwt', "abnc", { maxAge: 1 });
    res.redirect('/');
}

module.exports = { signup_get, login_get, signup_post, login_post, logout };