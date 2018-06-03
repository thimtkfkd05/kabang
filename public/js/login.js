$(document).ready(function() {
  console.log('11');
  $('#login').click(function() {
    var email = $('#InputEmail1').val();
    var password = $('#InputPassword1').val();
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
          location.href = '/mypage';
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