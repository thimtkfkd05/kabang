
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

app.get('/', routes.index);

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
