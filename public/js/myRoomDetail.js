$(document).ready(function() {
  $('.request_accept').click(function() {
    var $request_info = $(this).parent();
    var request_id = $request_info.data('request-id');
    $.post('/controlRequest', {
      request_id: request_id,
      status: 'accept'
    }, function(res) {
      if (res.err || !res.result) {
        alert('Request Accept Failed! Try Again.');
      } else {
        $request_info.find('button').remove();
        $request_info.append('Contact To : <span class="contact">' + res.contact + '</span>');
      }
    });
  });
  
  $('.request_reject').click(function() {
    var $request_info = $(this).parent();
    var request_id = $request_info.data('request-id');
    $.post('/controlRequest', {
      request_id: request_id,
      status: 'reject'
    }, function(res) {
      if (res.err || !res.result) {
        alert('Request Reject Failed! Try Again.');
      } else {
        $request_info.find('button').remove();
        $request_info.append('Request Rejected');
      }
    });
  });

  $(document).on('click', '.img-thumbnail', function() {
    $('#img').attr('src', $(this).attr('src'));
  });
});

