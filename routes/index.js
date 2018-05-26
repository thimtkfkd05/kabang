const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const keys = require('../service-key.json');

const host = 'localhost:3000';
const config = {
  service: 'Gmail',
  host: 'localhost',
  port: 465,
  auth: {
    type: 'oauth2',
    user: keys.client_email,
    serviceClient: keys.client_id,
    privateKey: keys.private_key
  },
  tls: {
    rejectUnauthorize: false,
  }
};

function make_random_string(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

exports.index = function(req, res){
  res.render('index.html');
};

exports.map = function(req, res){
  res.render('map.html');
};
exports.auth.send_verification = function(req, res) {
  var user_db = req.app.get('db').collection('Users');
  var user_id = req.body.user_id;
  var user_email = req.body.user_email;

  if (user_email && user_email.indexOf('@kaist.ac.kr') > -1) {
    user_db.findOne({
      id: user_id,
      email: user_email,
      type: 'student'
    }, function(find_err, find_res) {
      if (find_err || !find_res) {
        res.json({
          result: false,
          err: 'not_signup'
        });
      } else {
        var verify_code = new Buffer(user_id + '_' + new Date().getTime() + '_' + make_random_string(13)).toString('base64');
        user_db.update({
          id: user_id,
          email: user_email,
          type: 'student'
        }, {
          verify_code: verify_code
        }, function(update_err, update_res) {
          if (update_err) {
            res.json({
              result: false,
              err: update_err
            });
          } else {
            const transporter = nodemailer.createTransport(smtpPool(config));
            var accept_link = host + '/auth/accept_verification?verify_code=' + verify_code;
            var mail_options = {
              from: '"no-reply" <contact@kabang.com>',
              to: user_email,
              subject: '[KABANG] Student Verification Email',
              html: [
                'This is email only for your <b>Student Verification</b>.',
                '<br><br>If you want to verify your KABANG account, ',
                'please click the below <b>Verify</b> button.<br><br><br>',
                '<a href="', accept_link ,'" class="btn btn-lg btn-primary" style="text-align: center;">Verify</a>'
              ].join('')
            };

            transporter.sendMail(mail_options, function(err, info) {
              if (err) {
                res.json({
                  result: false,
                  err: err
                });
              } else {
                res.json({
                  result: true
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.json({
      result: false,
      err: 'not_kaist_student'
    });
  }
};

exports.auth.accept_verification = function(req, res) {
  var user_db = req.app.get('db').collection('Users');
  var verify_code = req.query.verify_code;
  
  if (verify_code) {
    verify_code = new Buffer(verify_code, 'base64').toString();
    var user_id = verify_code.substring(0, verify_code.indexOf('_'));
    user_db.update({
      id: user_id,
      type: 'student',
      is_verified: false,
      verify_code: verify_code
    }, {
      is_verified: true
    }, function(update_err, update_res) {
      if (update_err) {
        // db update fail
        res.render('404.html');
      } else {
        req.session.user_id = user_id;
        req.session.type = 'student';
        res.redirect('/student');
      }
    })
  } else {
    // verify_code not found
    res.render('404.html');
  }
};

exports.auth.signup = function(req, res) {
  var user_db = req.app.get('db').collection('Users');
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var type = req.body.type;

  if (email && password && name && type) {
    var user_obj = {
      id: email.substring(0, email.indexOf('@')) + '_' + make_random_string(13),
      email: email,
      password: new Buffer(password).toString('base64'),
      type: type
    };
    if (type == 'student') {
      user_obj['is_verified'] = false;
    }
    user_db.save(user_obj, function(save_err, save_res) {
      if (save_err) {
        res.render({
          result: false,
          err: save_err
        });
      } else {
        res.render({
          result: true
        });
      }
    });
  }
};

exports.auth.login = function(req, res) {
  var user_db = req.app.get('db').collection('Users');
  var email = req.body.email;
  var password = req.body.password;
  var type = req.body.type;

  if (email && password && type) {
    var find_query = {
      email: email,
      password: new Buffer(password, 'base64').toString(),
      type: type
    };
    if (type == 'student') {
      find_query['is_verified'] = true;
    }
    user_db.findOne(find_query, {
      id: 1
    }, function(find_err, find_res) {
      var redirect_url = '/';
      if (find_err || !find_res) {
        redirect_url += type + '_login'
        res.redirect(redirect_url);
      } else {
        req.session.user_id = find_res.id;
        req.session.user_type = type;
        redirect_url += type;
        res.redirect(redirect_url);
      }
    });
  } else {
    var redirect_url = '/' + (type || 'student') + '_login';
    res.redirect(redirect_url);
  }
};

exports.auth.logout = function(req, res) {
  var redirect_url = '/' + req.session.user_type + '_login';
  delete req.session.user_id;
  delete req.session.user_type;
  
  res.redirect(redirect_url);
};
