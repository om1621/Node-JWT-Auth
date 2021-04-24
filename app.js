const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middelwares/authMiddelware');

const app = express();

const auth = require('./routes/auth')

require('dotenv').config();

// static files
app.use(express.static('./public'))

// parse json
app.use(express.json());

// parse cookies
app.use(cookieParser());

// setting ejs as view engine
app.set('view engine', 'ejs');

// Routes
app.get('*', checkUser);

app.get('/', (req, res) => {
    res.render('Home')
})

app.get('/recipes', requireAuth, (req, res) => {
    res.render('Recipes')
})

// router routes
app.use('/auth', auth);

// connecting to database
const db_uri = process.env.MONGODB_URI;

mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(res => {
        console.log("db connected");
        app.listen(5000, () => {
            console.log("Listening on port 5000");
        })
    })
    .catch(err => {
        console.log(err);
    })

