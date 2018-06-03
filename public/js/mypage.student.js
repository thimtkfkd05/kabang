$(document).ready(function() {
  $.get('/get_student_room_list', {}, function(_res) {
    if (_res && _res.length) {
      var find_query = {
        room_id: {$in: _res}
      };
      $.get('/getroom', find_query, function(res) {
        var room_list = [];
        var roomNo = 0;
        if (res) {
          room_list = res.result;
          roomNo = room_list.length;
        }

        if (roomNo == 0) {
          $('div.row_adder').append('<p>Result Not Found</p>');
        } else if (roomNo == 1) {
          $('div.row_adder').append(
            roomcard(
              '/roomDetail?type=student&room_id='+room_list[0].room_id,
              room_list[0].location,
              room_list[0].picture[0],
              room_list[0].deposit+', '+room_list[0].monthly+'/month',
              room_list[0].type
            )
          );
        } else {
          for (var i = 0; i < roomNo/2 ; i++) {
            var html = '<div class="row">';
            for (var j = 0; j < 2; j++){
              html += roomcard(
                '/roomDetail?type=student&room_id='+room_list[2*i+j].room_id, 
                room_list[2*i+j].location,
                room_list[2*i+j].picture[0],
                room_list[2*i+j].deposit+', '+room_list[2*i+j].monthly+'/month',
                room_list[2*i+j].type
              );
              if(roomNo%2==1 && i > roomNo/2 -1){ break; }
            }
            html += '</div>';
            $('div.row_adder').append(html);
          }
        }
      });
    } else {
      $('div.row_adder').append('<p>Result Not Found</p>');
    }
  });
});