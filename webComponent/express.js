Promise=require('bluebird')
mysql=require('mysql');
dbf=require('./dbf-setup.js');
var credentials = require('./credentials.json');
var express = require('express');
var path = require('path');
app = express(),
port = process.env.PORT || 1337;
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var app = express();
var array = [];

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));

var queryDatabase = function(dbf, sql){
  queryResults = dbf.query(mysql.format(sql));
  return(queryResults);
}

var fillInArray = function(result, array){
  array = result;
  return(array);
}

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.get("/send",
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.send("hello");
});

app.get("/studentWorkers",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('studentWorkers');
});

app.get("/currentProject",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('currentProject');
});

app.get("/organization",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('organization');
});

app.get("/archive",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('archive');
});

app.get("/getstudentWorkers",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var sql = "SELECT studentID, `Last Name`, `First Name`, `Email Address`, City, State, Country, date_format(`Graduation Year`, '%Y-%M') AS `Graduation Year` , Major FROM Roch.studentWorkers LIMIT 18;";
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.get("/query",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var selectedSearchTerm = req.param('selectedSearchTerm');
      var searchTerm = req.param('searchTerm');
      var sql = "SELECT studentID, `Last Name`, `First Name`, `Email Address`, City, State, Country, date_format(`Graduation Year`, '%Y-%M') AS `Graduation Year` , Major FROM Roch.studentWorkers WHERE "
      + selectedSearchTerm + " Like " + "'%" + searchTerm + "%'" + " LIMIT 18;";
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.listen(port);
