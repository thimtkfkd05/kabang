$(document).ready(function(){

    var roomimg = function(img) {
        return [
            '<img src="',img,'" class="img-thumbnail" alt="etc img" width="50" height="50" onclick="changeimg()">',   
        ].join('');
    };

    var room_img;
    for(var i=1; i<=6; i++){
        room_img = 'room_img.jpg';
        var html = roomimg(room_img);
        $('div.room_img_btn').append(html);
    };
    
});