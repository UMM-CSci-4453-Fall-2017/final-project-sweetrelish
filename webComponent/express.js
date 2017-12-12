Promise=require('bluebird')
mysql=require('mysql');
dbf=require('./dbf-setup.js');
var credentials = require('./credentials.json');
var express = require('express');
var HashMap = require('hashmap');
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

app.get("/addRecord",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('addRecord');
});

app.get("/queryresult",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('queryresult');
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

app.get("/getProjectInfo",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var sql = "SELECT count(*) AS COUNT FROM Roch.Projects WHERE `End Date` > NOW();";
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.get("/getStudentWorkersInfo",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var sql = "SELECT count(*) AS COUNT FROM Roch.studentWorkers WHERE `Graduation Year` > NOW();";
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
      + "`" + selectedSearchTerm + "`" + " Like " + "'%" + searchTerm + "%'" + " LIMIT 18;";
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.get("/scrollDownStudentWorkers",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var skipTerm = req.param('skipTerm');
      var sql = "SELECT studentID, `Last Name`, `First Name`, `Email Address`, City, State, Country, date_format(`Graduation Year`, '%Y-%M') AS `Graduation Year` , Major FROM Roch.studentWorkers " +
      "LIMIT " + skipTerm + ", 18;";
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.get("/selectStudentWorkersProject",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var studentID = req.param('studentID');
      var sql = "SELECT studentID, `Last Name`, `First Name`, `Email Address`, City, State, Country, date_format(`Graduation Year`, '%Y-%M') AS `Graduation Year` , Major, " +
      "(SELECT GROUP_CONCAT(`Project Title` SEPARATOR ', ') FROM Roch.Projects where projectID in (SELECT projectID from Roch.studentsprojects where studentID = " + studentID + ")) AS " +
      "`Project Title` FROM Roch.studentWorkers WHERE studentID = " + studentID + ";"
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
      })
});

app.get("/deleteStudentWorker",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        var studentID = req.param('studentID');
        var sql = "DELETE FROM Roch.studentWorkers WHERE studentID = " + studentID + ";"
        console.log(sql);
        var query = queryDatabase(dbf, sql)
          .then(function (){
            return res.send();
        })
});

app.get("/updateStudentWorkers",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var map = new Array();
      var sqlInsert = "";
      var studentID = req.param('studentID');
      if (req.param('last_name') != "") {
        map.push("`Last Name`");
        map.push(req.param('last_name'));
      }
      if (req.param('first_name') != "") {
        map.push("`First Name`");
        map.push(req.param('first_name'));
      }
      if (req.param('email_address') != "") {
        map.push("`Email Address`");
        map.push(req.param('email_address'));
      }
      if (req.param('city') != "") {
        map.push("`City`");
        map.push(req.param('city'));
      }
      if (req.param('state') != "") {
        map.push("`State`");
        map.push(req.param('state'));
      }
      if (req.param('country') != "") {
        map.push("`Country`");
        map.push(req.param('country'));
      }
      if (req.param('graduation_year') != "") {
        map.push("`Graduation Year`");
        map.push(req.param('graduation_year'));
      }
      if (req.param('major') != "") {
        map.push("`Major`");
        map.push(req.param('major'));
      }
      if (map.length == 2){
        console.log("Shouldn't be here")
        sqlInsert = sqlInsert + map[0] + '="' + map[1] + '"';
      } else {
        for(var i = 0; i < map.length; (i+=2)){
          sqlInsert = sqlInsert + map[i] + ' = "'+ map[i+1] + '", ';
        }
        sqlInsert = sqlInsert.substring(0, sqlInsert.length - 2);
      }
      if (map.length == 0){
        res.send();
      }
      var sql = "UPDATE Roch.studentWorkers SET " + sqlInsert + " WHERE studentID = " + studentID + ";"
      var query = queryDatabase(dbf, sql)
        .then(function (){
          return res.send();
      })
});

app.get("/getProjects",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var sql = "SELECT `projectID`, `Project Status`, `Project Title`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, " +
      "date_format(`End Date`, '%Y-%M') AS `End Date`, `Project Intensity`, `Description` , `Funding Type`, `Status`, `Link to Project`, `Project Synopsis Link`, `Methodology` " +
      " FROM Roch.Projects LIMIT 10;";
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.get("/getSpecificProject",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var projectID = req.param("projectID");
      var sql = "SELECT `projectID`, `Project Status`, `Project Title`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, " +
      "date_format(`End Date`, '%Y-%M') AS `End Date`, `Project Intensity`, `Description` , `Funding Type`, `Status`, `Link to Project`, `Project Synopsis Link`, `Methodology` " +
      "FROM Roch.Projects WHERE projectID = " + projectID + ";";
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.get("/deleteProject",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        var projectID = req.param('projectID');
        var sql = "DELETE FROM Roch.Projects WHERE projectID = " + projectID + ";"
        console.log(sql);
        var query = queryDatabase(dbf, sql)
          .then(function (){
            return res.send();
        })
});

app.get("/saveChangestoProjects",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var map = new Array();
      var sqlInsert = "";
      var projectID = req.param('projectID');
      if (req.param('status') != "") {
        map.push("`Project Status`");
        map.push(req.param('status'));
      }
      if (req.param('title') != "") {
        map.push("`Project Title`");
        map.push(req.param('title'));
      }
      if (req.param('start_date') != "") {
        map.push("`Start Date`");
        map.push(req.param('start_date'));
      }
      if (req.param('end_date') != "") {
        map.push("`End Date`");
        map.push(req.param('end_date'));
      }
      if (req.param('intensity') != "") {
        map.push("`Project Intensity`");
        map.push(req.param('intensity'));
      }
      if (req.param('description') != "") {
        map.push("`Description`");
        map.push(req.param('description'));
      }
      if (req.param('funding_type') != "") {
        map.push("`Funding Type`");
        map.push(req.param('funding_type'));
      }
      if (req.param('project_status') != "") {
        map.push("`Status`");
        map.push(req.param('project_status'));
      }
      if (req.param('linktoproject') != "") {
        map.push("`Link to Project`");
        map.push(req.param('linktoproject'));
      }
      if (req.param('synopsisLink') != "") {
        map.push("`Project Synopsis Link`");
        map.push(req.param('synopsisLink'));
      }
      if (req.param('methodology') != "") {
        map.push("`Methodology`");
        map.push(req.param('methodology'));
      }
      if (map.length == 2){
        sqlInsert = sqlInsert + map[0] + '="' + map[1] + '"';
      } else {
        for(var i = 0; i < map.length; (i+=2)){
          sqlInsert = sqlInsert + map[i] + ' = "'+ map[i+1] + '", ';
        }
        sqlInsert = sqlInsert.substring(0, sqlInsert.length - 2);
      }
      if (map.length == 0){
        res.send();
      }
      var sql = "UPDATE Roch.Projects SET " + sqlInsert + " WHERE projectID = " + projectID + ";"
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(function (){
          return res.send();
      })
});

app.get("/queryProject",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var selectedSearchTerm = req.param('selectedSearchTerm');
      var searchTerm = req.param('searchTerm');
      var sql = "SELECT `projectID`, `Project Status`, `Project Title`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, " +
      "date_format(`End Date`, '%Y-%M') AS `End Date`, `Project Intensity`, `Description` , `Funding Type`, `Status`, `Link to Project`, `Project Synopsis Link`, `Methodology` " +
      " FROM Roch.Projects WHERE " + "`" + selectedSearchTerm + "`" + " Like " + "'%" + searchTerm + "%'" + " LIMIT 8;";
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});


app.get("/getOrganizations",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var sql = "SELECT * FROM Roch.organizations LIMIT 10";
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.get("/scrollDownOrganization",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var skipTerm = req.param('skipTerm');
      var sql = "SELECT *  FROM Roch.organizations LIMIT " + skipTerm + ", 10";
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.get("/scrollDownProject",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var skipTerm = req.param('skipTerm');
      var sql = "SELECT `projectID`, `Project Status`, `Project Title`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, " +
      "date_format(`End Date`, '%Y-%M') AS `End Date`, `Project Intensity`, `Description` , `Funding Type`, `Status`, `Link to Project`, `Project Synopsis Link`, `Methodology` " +
      " FROM Roch.Projects LIMIT " + skipTerm + ", 10;" ;
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.get("/storeToDatabase",
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      var sql = "SELECT `projectID`, `Project Status`, `Project Title`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, date_format(`Start Date`, '%Y-%M') AS `Start Date`, " +
      "date_format(`End Date`, '%Y-%M') AS `End Date`, `Project Intensity`, `Description` , `Funding Type`, `Status`, `Link to Project`, `Project Synopsis Link`, `Methodology` " +
      " FROM Roch.Projects LIMIT " + skipTerm + ", 10;" ;
      console.log(sql);
      var query = queryDatabase(dbf, sql)
        .then(fillInArray(array))
        .then(function (array){
          return res.send(array);
        })
});

app.listen(port);
