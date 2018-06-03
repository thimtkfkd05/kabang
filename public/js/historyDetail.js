$(document).ready(function() {
  $('.rating i.fa').click(function() {
    var index = $(this).index();
    $('.rating i.fa').addClass('fa-star-o').removeClass('fa-star');
    for (var i = 0; i <= index; i++) {
      $('.rating i.fa').eq(i).removeClass('fa-star-o').addClass('fa-star');
    }
  });
});