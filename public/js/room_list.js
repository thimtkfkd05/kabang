$(document).ready(function() {
  var find_query = {};
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
          '/roomDetail',
          room_list[0].location,
          room_list[0].picture,
          room_list[0].deposit+'/'+room_list[0].monthly,
          room_list[0].type
        )
      );
    } else {
      for (var i = 0; i < roomNo/2 ; i++) {
        var html = '<div class="row">';
        for (var j = 0; j < 2; j++){
          html += roomcard(
            '/roomDetail', 
            room_list[2*i+j].location,
            room_list[2*i+j].picture,
            room_list[2*i+j].deposit+'/'+room_list[2*i+j].monthly,
            room_list[2*i+j].type
          );
          if(roomNo%2==1 && i > roomNo/2 -1){ break; }
        }
        html += '</div>';
        $('div.row_adder').append(html);
      }
    }
  });
});