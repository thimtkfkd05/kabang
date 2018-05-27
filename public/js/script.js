$(document).ready(function() {
  console.log("Hello World!");
});

<div class="div_class_wrapper"></div>

var roomcard = function(loc, img, pri, typ) {
  return [
    '<div class="row">',
      '<div class="col">',
        '<a href="#" class="btn btn-block btn-outline-light text-dark" role="button">',
          '<div class="card">',
            '<div class="card-header">',loc,'</div>',
            '<div class="card-body">',
              '<img class="card-img-top" src="',img,'" alt="Card image">',
            '</div>',
            '<div class="card-footer">',
              '<div class="col">',pri,'</div>',
              '<div class="col">',typ,'</div>',
            '</div>',
          '</div>',
        '</a>',
      '</col>',
      '<div class="col">',
        '<a href="#" class="btn btn-block btn-outline-light text-dark" role="button">',
          '<div class="card">',
            '<div class="card-header">',loc,'</div>',
            '<div class="card-body">',
              '<img class="card-img-top" src="',img,'" alt="Card image">',
            '</div>',
            '<div class="card-footer">',
              '<div class="col">',pri,'</div>',
              '<div class="col">',typ,'</div>',
            '</div>',
          '</div>',
        '</a>',
      '</col>',
    '</div>'
  ].join('');
};

for (var i = 0; i < 4; i++) {
  $('div.div_class_wrapper').append(roomcard('Location', "img.jpg" , 'Price', 'Type'));
}

//<div class="div_class_wrapper"></div>