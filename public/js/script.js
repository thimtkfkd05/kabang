$(document).ready(function() {
  $('.btn-logout').click(function() {
    $.post('/auth/logout', {}, function(result) {
      location.href = '/login';
    });
  });
});
//<div class="div_class_wrapper"></div>