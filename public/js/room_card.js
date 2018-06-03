var roomcard = function(id, loc, img, pri, typ) {
  return [
    '<div class="col-6">',
      '<a class="btn btn-block btn-outline-light text-dark" role="button">',
        '<div class="card">',
          '<div class="card-header">',loc,'</div>',
          '<div class="card-body">',
            '<img class="card-img-top" value="',id,'" style="width: 300px; height: 300px; object-fit: container;" src="',img,'" alt="Card image">',
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