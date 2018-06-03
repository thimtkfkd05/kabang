const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const keys = require('../service-key.json');
const async = require('async');

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

exports.roomlist = function(req,res){
  res.render('roomlist.html');
};

exports.loginpage = function(req,res){
  res.render('loginpage.html');
};

exports.registerRoomOwner = function(req,res){
  res.render('registerRoomOwner.html');
};

exports.registerStudent = function(req,res){
  res.render('registerStudent.html');
};

exports.searchPage = function(req,res){
  res.render('searchpage.html');
}
exports.roomDetail = function(req,res){
  var room_db = db.collection('Rooms');
  if (req.query.room_id) {
    room_db.findOne({
      'room_id': req.query.room_id
    }, function(find_err, find_res) {
      if(find_err){
        res.redirect('/mypage');
      }
      else{
        res.render('roomDetail.html', find_res);
      }
    });
  } else {
    room_db.findOne({
      'room_id': 'room0'
    }, function(find_err, find_res){
      if(find_err){
        res.redirect('/mypage');
      }
      else{
        res.render('roomDetail.html', find_res);
      }
    });
  }
};

exports.roomregister = function(req,res){
  res.render('roomregister.html');
};

exports.mypage = function(req, res) {
  if (req.session.type == 'room_owner') {
    res.render('mypage.roomOwner.html');
  } else if (req.session.type == 'student') {
    res.render('mypage.student.html');
  } else {
    // res.redirect('/login');
    res.render('mypage.roomOwner.html');
  }
}
exports.auth = function(req, res) {
  res.json(null);
};

exports.auth.send_verification = function(req, res) {
  var user_db = db.collection('Users');
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
  var user_db = db.collection('Users');
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
  var user_db = db.collection('Users');
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
        res.json({
          result: false,
          err: save_err
        });
      } else {
        res.json({
          result: true
        });
      }
    });
  } else {
    res.json({
      result: false,
      err: 'empty_input'
    })
  }
};

exports.auth.login = function(req, res) {
  var user_db = db.collection('Users');
  var email = req.body.email;
  var password = req.body.password;

  if (email && password) {
    var find_query = {
      email: email,
      password: password
    };
    user_db.findOne(find_query, {
      id: 1,
      type: 1,
      is_verified: 1
    }, function(find_err, find_res) {
      console.log(find_err, find_res);
      if (find_err || !find_res) {
        res.json({
          result: false,
          err: find_err
        });
      } else {
        if (find_res.type == 'student' && find_res.is_verified == false) {
          res.json({
            result: false,
            err: 'not_verified'
          });
        } else {
          req.session.user_id = find_res.id;
          req.session.user_type = find_res.type;
          res.json({
            result: true,
            type: find_res.type
          });
        }
      }
    });
  } else {
    res.json({
      result: false,
      err: 'empty_input'
    });
  }
};

exports.auth.logout = function(req, res) {
  delete req.session.user_id;
  delete req.session.user_type;
  
  res.json(true);
};

exports.getroom = function(req, res){
  
  var room_db = db.collection('Rooms');
  var d = 1;
  var d_min = parseInt (req.query.d_min)-1;
  var d_max = parseInt (req.query.d_max)+1;
  var m_min = parseInt (req.query.m_min)-1;
  var m_max = parseInt (req.query.m_max)+1;
  var lat = parseFloat (req.query.lat);
  var lng = parseFloat (req.query.lng);
  
  var find_query = {
    type: req.query.room_type,
    deposit: { $gt: d_min, $lt: d_max},
    monthly: { $gt: m_min, $lt: m_max},
    'location.lat': { $gt: lat - d, $lt: lat + d},
    'location.lng': { $gt: lng - d, $lt: lng + d}
  };
  
  room_db.find(find_query).toArray(function(find_err, find_res) {
    if (find_err) {
      throw find_err;
    } else {

      console.log (find_res);
      res.json({
        result: find_res
      });
    }
  });
};

exports.get_student_room_list = function(req, res) {
  if (req.session.type == 'student') {
    var user_db = db.collection('Users');
    user_db.findOne({
      id: req.session.user_id,
      type: req.session.type
    }, {
      room_list: 1
    }, function(find_err, find_res) {
      if (find_err) {
        res.json(null);
      } else {
        res.json(find_res);
      }
    });
  } else {
    res.json(null);
  }
};

exports.getcomment = function(req, res) {
  var comment_db = db.collection('Comments');
  var room_list = req.body.rooms;
  async.map(room_list, function(room, next) {
    if (!room.comments || !room.comments.length) {
      next(null);
    } else {
      comment_db.find({
        comment_id: {$in: room.comments}
      }).toArray(function(find_err, find_res) {
        if (find_err) {
          next(null);
        } else {
          next(find_res);
        }
      });
    }
  }, function(async_err, comment_list) {
    if (async_err) {
      res.json(null);
    } else {
      res.json(comment_list);
    }
  });
};
  
exports.detailRoom = function(req,res){
  var room_db = db.collection('Rooms');
  room_db.findOne({
    'room_id': 'room0'
  }, function(find_err, find_res){
    if(find_err){res.json(null);}
    else{
      res.json({result: find_res});
    }
  });
};

exports.register_room = function(req, res){
  var room_db = db.collection('Rooms');
  var room_picture = req.body.picture;
  var room_deposit = req.body.deposit;
  var room_monthly = req.body.monthly;
  var room_type = req.body.type;
  var room_status = req.body.status;
  var room_date = req.body.enrolled_date
  var room_description = req.body.description;
  var room_option = req.body.option;
  var room_location = req.body.location;
  var room_owner = req.session.user_id;
  room_location.lat  = Number(room_location.lat);
  room_location.lng  = Number(room_location.lng);
    var room_obj = {
      room_id: make_random_string(13),
      picture: room_picture,
      deposit: Number(room_deposit),
      monthly: Number(room_monthly),
      type: room_type,
      status: room_status,
      location: room_location,
      description: room_description,
      option: room_option,
      enrolled_date: room_date,
      owner : room_owner,
    };
    room_db.save(room_obj, function(save_err, save_res) {
      if(save_err) {
        console.log("fail!!");
        res.json({
          result: false,
          err: save_err
          
          
        });

      }else{
        res.json({
          result: true,
        });
        console.log("Success!!");
      }
    });
  
  }