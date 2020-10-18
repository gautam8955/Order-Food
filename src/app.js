//Controller file of Project

var express = require('express');
var ejs = require('ejs');

const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const restaurantRoute = require('./routes/restaurant');
const customerRoute = require('./routes/customer');
const home = require('./routes/home');

// 'mongodb://localhost/Online_Food_Order'

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/Online_Food_Order', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/views'));


 app.use(restaurantRoute);
 app.use(customerRoute);
 app.use(home);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


module.exports = app;