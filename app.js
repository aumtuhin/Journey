const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
// const socket = require('socket.io');
const config = require('./config/db');
const port = process.env.PORT || 8080;

//conect to db
mongoose.connect(config.dbcon, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('We are connected');
});


//require routes
const index = require('./routes/index');
const dashboard = require('./routes/dashboard');
const destination = require('./routes/destination');
const user = require('./routes/user');


//initailise app
const app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set static files folder
app.use(express.static('public'));

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

//express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//routes
app.use('/', index);
app.use('/dashboard', dashboard);
app.use('/destination', destination);

//listen server
app.listen(port, () => {
    console.log('app is running on port 8080');
});