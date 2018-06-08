$(document).ready(function() {
  $.get('/get_student_room_list', {}, function(res) {
    var favorite_list = [];
    var history_list = [];
    var favoriteNo = 0;
    var historyNo = 0;
    if (res) {
      favorite_list = res.favorite_list;
      history_list = res.history_list;
      favoriteNo = favorite_list.length;
      historyNo = history_list.length;
    }

    if (favoriteNo == 0) {
      $('div.row_adder.favorites').append('<p>Result Not Found</p>');
    } else if (favoriteNo == 1) {
      $('div.row_adder.favorites').append(
        roomcard(
          '/roomDetail?room_id='+favorite_list[0].room_id,
          favorite_list[0].address,
          favorite_list[0].picture[0],
          favorite_list[0].deposit+'만원, '+favorite_list[0].monthly+'만원/월',
          favorite_list[0].type
        )
      );
    } else {
      for (var i = 0; i < favoriteNo/2 ; i++) {
        var html = '<div class="row">';
        for (var j = 0; j < 2; j++){
          html += roomcard(
            '/roomDetail?room_id='+favorite_list[2*i+j].room_id,
            favorite_list[2*i+j].address,
            favorite_list[2*i+j].picture[0],
            favorite_list[2*i+j].deposit+'만원, '+favorite_list[2*i+j].monthly+'만원/월',
            favorite_list[2*i+j].type
          );
          if(favoriteNo%2==1 && i > favoriteNo/2 -1){ break; }
        }
        html += '</div>';
        $('div.row_adder.favorites').append(html);
      }
    }

    if (historyNo == 0) {
      $('div.row_adder.histories').append('<p>Result Not Found</p>');
    } else if (historyNo == 1) {
      $('div.row_adder.histories').append(
        roomcard(
          '/roomDetail?type=student&room_id='+history_list[0].room_id,
          history_list[0].address,
          history_list[0].picture[0],
          history_list[0].deposit+'만원, '+history_list[0].monthly+'만원/월',
          history_list[0].type
        )
      );
    } else {
      for (var i = 0; i < historyNo/2 ; i++) {
        var html = '<div class="row">';
        for (var j = 0; j < 2; j++){
          html += roomcard(
            '/roomDetail?type=student&room_id='+history_list[2*i+j].room_id,
            history_list[2*i+j].address,
            history_list[2*i+j].picture[0],
            history_list[2*i+j].deposit+'만원, '+history_list[2*i+j].monthly+'만원/월',
            history_list[2*i+j].type
          );
          if(historyNo%2==1 && i > historyNo/2 -1){ break; }
        }
        html += '</div>';
        $('div.row_adder.histories').append(html);
      }
    }
  });
});