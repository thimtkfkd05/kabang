$(document).ready(function() {
  $('.btn-logout').click(function() {
    $.post('/auth/logout', {}, function(result) {
      href.location = '/login';
    });
  });
});
//<div class="div_class_wrapper"></div>