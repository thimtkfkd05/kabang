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
db = null;

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
function checker(type) {
  return function(req, res, next) {
    var user_db = app.get('db').collection('Users');
    var user_id = req.session.user_id;
    var user_type = req.session.user_type;
    
    if (user_id && user_type && (!type || user_type == type)) {
      user_db.findOne({
        id: user_id,
        type: user_type
      }, function(find_err, find_res) {
        if (find_err || !find_res) {
          res.redirect('/login');
        } else {
          if (find_res.type == 'student' && !find_res.is_verified) {
            res.redirect('/need_verification');
          } else {
            next();
          }
        }
      });
    } else {
      res.redirect('/login');
    }
  }
};

app.get('/', routes.index);
app.get('/roomlist', routes.roomlist);
app.get('/login', routes.loginpage);
app.get('/registerRoomOwner', routes.registerRoomOwner);
app.get('/registerStudent', routes.registerStudent);
app.get('/search', routes.searchPage);

app.post('/auth/login', routes.auth.login);
app.post('/auth/logout', checker(), routes.auth.logout);
app.post('/auth/signup', routes.auth.signup);
app.post('/auth/send_verification', routes.auth.send_verification);
app.get('/auth/accept_verification', routes.auth.accept_verification);

function connectDB() {
  var dbUrl = 'mongodb://localhost:27017';
  var mongoClient = mongodb.MongoClient;

  mongoClient.connect(dbUrl, {
    useNewUrlParser: true
  }, function(err, mongoclient) {
    if (err) throw err;
    console.log('DB connection success!');
    db = mongoclient.db('kabang');
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