$(document).ready(function() {
  
  var query = window.location.href;
  query = query.split('?');
  query = query[1].split('&');

  var lat = parseFloat (query[0].split('=')[1]);
  var lng = parseFloat (query[1].split('=')[1]);
  var d_min = parseInt (query[2].split('=')[1]);
  var d_max = parseInt (query[3].split('=')[1]);
  var m_min = parseInt (query[4].split('=')[1]);
  var m_max = parseInt (query[5].split('=')[1]);
  var room_type = query[6].split('=')[1];

  var find_query = {
    'lat' : lat,
    'lng' : lng,
    'room_type' : room_type,
    'd_min' : d_min,
    'd_max' : d_max,
    'm_min' : m_min,
    'm_max' : m_max
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
          room_list[0].room_id,
          room_list[0].address,
          room_list[0].picture[0],
          room_list[0].deposit+'만원, '+room_list[0].monthly+'만윈/월',
          room_list[0].type
        )
      );
    } else {
      for (var i = 0; i < roomNo/2 ; i++) {
        var html = '<div class="row">';
        for (var j = 0; j < 2; j++){
          html += roomcard(
            room_list[2*i+j].room_id, 
            room_list[2*i+j].address,
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
});

$(document).on('click', '.card', function(){

  var query = "/roomDetail?room_id=";
  query += $(this).find('.card-img-top').attr('value');
  window.location.href = query;

});