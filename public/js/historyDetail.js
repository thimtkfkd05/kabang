$(document).ready(function() {
  $('.rating i.fa').click(function() {
    var index = $(this).index();
    $('.rating i.fa').addClass('fa-star-o').removeClass('fa-star');
    for (var i = 0; i <= index; i++) {
      $('.rating i.fa').eq(i).removeClass('fa-star-o').addClass('fa-star');
    }
  });

  $('#save_comment').click(function() {
    var star_rating = $('.rating i.fa-star').length;
    var comment = $('#write_comment').val();
    $.post('/saveComment', {
      room_id: $('#room_id').text(),
      star_rating: star_rating,
      comment: comment
    }, function(res) {
      if (!res) {
        alert('Save Failed! Try Again.');
      } else {
        location.reload();
      }
    });
  });

  $(document).on('click', '.img-thumbnail', function() {
    $('#img').attr('src', $(this).attr('src'));
  });
});

