
/**
 * Module dependencies.
 */

var express = require('express')
  , session = require('express-session')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , mongodb = require('mongodb');

var app = express();
var port = process.env.PORT || 3000;

app.configure(function(){
  app.set('port', port);
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(session({
    secret: 'thrhdro',
    resave: false,
    saveUninitialized: true
  }));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// check if this user is logged in
// if feature needs login, use this before routes function
function checker(req, res, next) {
  var user_db = app.get('db').collection('Users');
  user_db.findOne({
    id: req.session.user_id,
    type: req.session.user_type
  }, function(find_err, find_res) {
    if (find_err || !find_res) {
      res.redirect('/student_login');
    } else {
      next();
    }
  })
};

app.get('/', routes.index);

app.post('/auth/login', routes.auth.login);
app.post('/auth/logout', checker, routes.auth.logout);
app.post('/auth/signup', routes.auth.signup);
app.post('/auth/send_verification', routes.auth.send_verification);
app.get('/auth/accept_verification', routes.auth.accept_verification);

function connectDB() {
  var dbUrl = 'mongodb://localhost:27017';
  var mongoClient = mongodb.MongoClient;

  mongoClient.connect(dbUrl, function(err, db) {
    if (err) throw err;
    console.log('DB connection success!');
    app.set('db', db);
  });
};

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  connectDB();
});


// DB use example
// var db = app.get('db'); // if db use in app.js, this line doesn't need
// var user_db = db.collection('Users');
// user_db.find({
//   id: 'user_id_ex',
//   name: 'user_name_ex'
// }).toArray(function(find_err, find_res) {
//   var user_list = find_res;
//   ...
//   // if just find only one user, change "find" -> "findOne" &  ").toArray(" -> ","
//   // other actions just refer mongodb manual
// });
