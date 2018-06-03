var roomcard = function(ref, loc, img, pri, typ) {
  return [
    '<div class="col-6">',
      '<a href="', ref, '" class="btn btn-block btn-outline-light text-dark" role="button">',
        '<div class="card">',
          '<div class="card-header">',loc,'</div>',
          '<div class="card-body">',
            '<img class="card-img-top" style="width: 300px; height: 300px; object-fit: container;" src="',img,'" alt="Card image">',
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

var room_owner_roomcard = function(ref, loc, img, stars, status) {
  return [
    '<div class="col-6">',
      '<a href="', ref, '" class="btn btn-block btn-outline-light text-dark" role="button">',
        '<div class="card">',
          '<div class="card-header">',loc,'</div>',
          '<div class="card-body">',
            '<img class="card-img-top" style="width: 300px; height: 300px; object-fit: container;" src="',img,'" alt="Card image">',
          '</div>',
          '<div class="card-footer">',
            '<div class="row">',
              '<div class="col-6">',stars,'</div>',
              '<div class="col-6">',status,'</div>',
            '</div>',
          '</div>',
        '</div>',
      '</a>',
    '</div>'
  ].join('');
};