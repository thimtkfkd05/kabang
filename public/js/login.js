$(document).ready(function() {
  $('#login').click(function() {
    var email = $('#email').val();
    var password = $('#password').val();
    console.log('??');
    if (email && password) {
      $.post('/auth/login', {
        email: email,
        password: btoa(password)
      }, function(result) {
        if (!result.result || result.err) {
          $('.alert').show();
          setTimeout(function() {
            $('.alert').hide();
          }, 2000);
        } else {
          location.href = '/' + result.type;
        }
      });
    } else {
      $('.alert').show();
      setTimeout(function() {
        $('.alert').hide();
      }, 2000);
    }
  });
});