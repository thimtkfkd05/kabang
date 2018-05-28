$(document).ready(function(){
    var roomimg = function(img) {
        return [
            '<button type="button" class="btn btn-primary">',
                '<img src="',img,'" class="img-thumbnail" alt="room img" width="50" height="50">',
            '</button>'
        ].join('');
    };

    var room_img;
    for(var i=0; i<6; i++){
        room_img = 'room_img.jpg';
        $('div.room_img.btn').append(roomimg(room_img));
    }
});