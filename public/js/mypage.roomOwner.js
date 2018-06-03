$(document).ready(function() {
  var find_query = {
    owner: true
  };
  $.get('/get_room_owner_room_list', find_query, function(res) {
    var room_list = [];
    var roomNo = 0;
    if (res) {
      room_list = res.result;
      roomNo = room_list.length;
    }

    if (roomNo == 0) {
      $('div.row_adder').append('<p>Result Not Found</p>');
    } else if (roomNo == 1) {
      $.post('/getcomment', {
        rooms: room_list
      }, function(comments_list) {
        var stars = '';
        var comments = comments_list[0];
        if (comments && comments.length) {
          var star_rating = 0;
          result.map(function(comment) {
            star_rating += comment.star_rating;
          });
          star_rating /= result.length;
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
        $('div.row_adder').append(
          room_owner_roomcard(
            '/roomDetail?type=room_owner&room_id='+room_list[0].room_id,
            room_list[0].location,
            room_list[0].picture[0],
            stars,
            room_list[0].status
          )
        );
      });
    } else {
      $.post('/getcomment', {
        rooms: room_list
      }, function(comments_list) {
        for (var i = 0; i < roomNo/2 ; i++) {
          var html = '<div class="row">';
          for (var j = 0; j < 2; j++){
            var stars = '';
            var comments = comments_list[2*i+j];
            if (comments && comments.length) {
              var star_rating = 0;
              result.map(function(comment) {
                star_rating += comment.star_rating;
              });
              star_rating /= result.length;
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
            html += room_owner_roomcard(
              '/roomDetail?type=room_owner&room_id='+room_list[2*i+j].room_id, 
              room_list[2*i+j].location,
              room_list[2*i+j].picture[0],
              stars,
              room_list[2*i+j].status
            );
            if(roomNo%2==1 && i > roomNo/2 -1){ break; }
          }
          html += '</div>';
          $('div.row_adder').append(html);
        }
      });
    }
  });
});