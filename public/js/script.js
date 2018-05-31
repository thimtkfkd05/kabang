$(document).ready(function() {
  console.log("Hello World!");


var roomcard = function(ref, loc, img, pri, typ) {
  return [
    '<div class="col-6">',
      '<a href="', ref, '" class="btn btn-block btn-outline-light text-dark" role="button">',
        '<div class="card">',
          '<div class="card-header">',loc,'</div>',
          '<div class="card-body">',
            '<img class="card-img-top" src="',img,'" alt="Card image">',
          '</div>',
          '<div class="card-footer">',
            '<div class="row">',
              '<div class="col-6">',pri,'</div>',
              '<div class="col-6">',typ,'</div>',
            '</div>',
          '</div>',
        '</div>',
      '</a>',
    '</div>'
  ].join('');
};

var roomNo = 7

$.get('/roomlist', {}, function(res) {
  if (res) {
    var room_list = res.result;
  }
})

for (var i = 0; i < roomNo/2 ; i++) {
  var html = '<div class="row">';
  for (var j = 0; j < 2; j++){
    html += roomcard('#', 'Location', 'img.jpg', 'Price', 'Type');
    if(roomNo%2==1 && i > roomNo/2 -1){ break; }
  }
  html += '</div>';
  $('div.row_adder').append(html);
}

});
//<div class="div_class_wrapper"></div>