const express = require('express');
const router = express.Router();
const { signup_get, login_get, signup_post, login_post, logout } = require('../controllers/authController')

router.get('/signup', signup_get);

router.post('/signup', signup_post);

router.get('/login', login_get);

router.post('/login', login_post);

router.get('/logout', logout);

module.exports = router;
