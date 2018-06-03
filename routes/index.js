const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const keys = require('../service-key.json');
const async = require('async');

const host = 'localhost:3000';
const config = {
  service: 'Gmail',
  host: 'localhost',
  port: 465,
  // auth: {
  //   type: 'OAuth2',
  //   user: 'thimtkfkd05@gmail.com',
  //   serviceClient: keys.client_id,
  //   privateKey: keys.private_key
  // },
  auth: {
    user: keys.user_email,
    pass: new Buffer(keys.user_pass, 'base64').toString()
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
        var comment_db = db.collection('Comments');
        comment_db.find({
          comment_id: {$in: find_res.comments}
        }).toArray(function(comment_err, comment_res) {
          if (comment_err) {
            res.redirect('/mypage');
          } else {
            var stars = '';
            if (comment_res && comment_res.length) {
              var star_rating = 0;
              comment_res.map(function(comment) {
                star_rating += comment.star_rating;
              });
              star_rating /= comment_res.length;
              var star_rating_floor = Math.floor(star_rating);
              var star_rating_round = Math.round(star_rating);
              for (var m = 0; m < star_rating_floor; m++) {
                stars += '<i class="fa fa-star"></i>';
              }
              if (star_rating_floor < star_rating_round) {
                stars += '<i class="fa fa-star-half-o"></i>';
              }
              for (var n = 5; n > star_rating_round; n--) {
                stars += '<i class="fa fa-star-o"></i>';
              }
            } else {
              for (var m = 0; m < 5; m++) {
                stars += '<i class="fa fa-star-o"></i>';
              }
            }
            find_res['comments'] = comment_res;
            find_res['stars'] = stars;
            find_res['user_type'] = req.query.type;
            
            if (req.query.type == 'room_owner') {
              var request_db = db.collection('Requests');
              request_db.find({
                room_id: req.query.room_id
              }).toArray(function(request_err, request_res) {
                if (request_err) {
                  res.redirect('/mypage');
                } else {
                  var user_db = db.collection('Users');
                  var user_id_list = request_res.map(function(request) {
                    return request.requested_user_id;
                  });
                  user_db.find({
                    id: {$in: user_id_list}
                  }, {
                    id: 1,
                    name: 1
                  }).toArray(function(user_err, user_res) {
                    if (user_err) {
                      res.redirect('/mypage');
                    } else {
                      request_res.map(function(_request) {
                        user_res.some(function(user) {
                          if (user.id == _request.requested_user_id) {
                            _request['requested_user_name'] = user.name;
                            return true;
                          }
                        });
                        return _request;
                      });
                      find_res['request_list'] = request_res;
                      res.render('roomDetail.html', find_res);
                    }
                  });
                }
              });
            } else {
              find_res['comments'] = comment_res;
              find_res['user_type'] = req.query.type;
              res.render('roomDetail.html', find_res);
            }
          }
        });
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
  if (req.session.user_type == 'room_owner') {
    res.render('mypage.roomOwner.html');
  } else if (req.session.user_type == 'student') {
    res.render('mypage.student.html');
  } else {
    res.redirect('/login');
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
        var verify_code = new Buffer(user_id + '-' + new Date().getTime() + '_' + make_random_string(13)).toString('base64');
        user_db.update({
          id: user_id,
          email: user_email,
          type: 'student'
        }, {
          $set: {
            verify_code: verify_code
          }
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
  var before_verify_code = req.query.verify_code;
  
  if (before_verify_code) {
    var verify_code = new Buffer(before_verify_code, 'base64').toString();
    var user_id = verify_code.substring(0, verify_code.indexOf('-'));
    user_db.update({
      id: user_id,
      type: 'student',
      is_verified: false,
      verify_code: before_verify_code
    }, {
      $set: {
        is_verified: true
      }
    }, function(update_err, update_res) {
      if (update_err) {
        // db update fail
        res.render('404.html');
      } else {
        req.session.user_id = user_id;
        req.session.user_type = 'student';
        res.redirect('/mypage');
      }
    });
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
          result: true,
          user_id: user_obj.id
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
  var d = 0.0035;
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
      res.json({
        result: find_res
      });
    }
  });
};

exports.get_room_owner_room_list = function(req, res) {
  if (req.session.user_type == 'room_owner' && req.query.owner) {
    var room_db = db.collection('Rooms');
    room_db.find({
      owner: req.session.user_id
    }).toArray(function(find_err, find_res) {
      if (find_err) {
        throw find_err;
      } else {
        res.json({
          result: find_res
        });
      }
    });
  } else {
    res.json(null);
  }
};

exports.get_student_room_list = function(req, res) {
  var history_db = db.collection('Histories');
  history_db.find({
    user_id: req.session.user_id
  }, {
    room_id: 1
  }).toArray(function(find_err, find_res) {
    if (find_err) {
      res.json(null);
    } else {
      var room_id_list = find_res.map(function(history) {
        return history.room_id;
      });
      var room_db = db.collection('Rooms');
      room_db.find({
        room_id: {$in: room_id_list}
      }).toArray(function(room_err, room_res) {
        if (room_err) {
          res.json(null);
        } else {
          res.json(room_res);
        }
      });
    }
  });
};

exports.getcomment = function(req, res) {
  var comment_db = db.collection('Comments');
  var room_list = req.body.rooms;
  async.map(room_list, function(room, next) {
    if (!room.comments) {
      room.comments = [];
    }
    comment_db.find({
      comment_id: {$in: room.comments}
    }).toArray(function(find_err, find_res) {
      if (find_err) {
        next(null);
      } else {
        next(null, find_res);
      }
    });
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
  var room_comment = [];
  var room_address = req.body.address;
  console.log(room_address);
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
      comments : room_comment,
      address : room_address, 
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


exports.sendRequest = function(req, res) {
  var room_db = db.collection('Rooms');
  var request_db = db.collection('Requests');
  var room_id = req.body.room_id;
  var user_id = req.session.user_id;

  var request_obj = {
    request_id: 'request_' + make_random_string(13),
    status: 'wait',
    room_id: room_id,
    requested_user_id: user_id
  };
  request_db.save(request_obj, function(save_err, save_res) {
    if (save_err || !save_res) {
      res.json({
        err: save_err,
        result: false
      });
    } else {
      res.json({
        result: true
      });
    }
  });
};

exports.controlRequest = function(req, res) {
  var room_db = db.collection('Rooms');
  var request_db = db.collection('Requests');
  var request_id = req.body.request_id;
  var status = req.body.status

  request_db.update({
    request_id: request_id
  }, {
    $set: {
      status: status
    }
  }, function(update_err, update_res) {
    if (update_err || !update_res) {
      res.json({
        err: update_err,
        result: false
      });
    } else {
      if (status == 'accept') {
        request_db.findOne({
          request_id: request_id
        }, {
          requested_user_id: 1
        }, function(request_err, request_res) {
          if (request_err || !request_res) {
            res.json({
              err: request_err,
              result: false
            });
          } else {
            var user_db = db.collection('Users');
            user_db.findOne({
              id: request_res.requested_user_id
            }, {
              contact: 1
            }, function(user_err, user_res) {
              if (user_err || !user_res) {
                res.json({
                  err: user_err,
                  result: false
                });
              } else {
                res.json({
                  result: true,
                  contact: user_res.contact
                });
              }
            });
          }
        });
      }
    }
  });
};