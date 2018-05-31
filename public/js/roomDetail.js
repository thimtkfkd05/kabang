$(document).ready(function(){

    $.get('/detailRoom',{},function(res){

        var room_info = res.result;
        

        var roomimg = function(img) {
            return [
                '<img src="',img,'" class="img-thumbnail" alt="etc img" width="50" height="50" onclick="changeimg()">',   
            ].join('');
        };

        var room_img = room_info.picture;
        for(var i=0; i<room_img.length; i++){
            var html = roomimg(room_img[i]);
            $('div.room_img_btn').append(html);
        };

        var comment = room_info.comments;
        for(var j=0; j<comment.length; j++){
            var comm = comment[j];
            comm += '<br /><br />';
            $('div.comment_text').append(comm);
        }

        var description = room_info.description;
        $('div.description_text').append(description);

        var deposit = room_info.deposit;
        $('div.deposit').append(deposit);
        $('div.deposit').append(' KRW');

        var monthly = room_info.monthly;
        $('div.monthly').append(monthly);
        $('div.monthly').append(' KRW');

        var roomtype = room_info.type;
        $('div.roomtype').append(roomtype);

        var roomstatus = room_info.status;
        $('div.roomstatus').append(roomstatus);

        var roomoption = room_info.option;
        for(var k=0; k<roomoption.length -1; k++){
            var option = roomoption[k];
            option += ', ';
            $('div.roomoption').append(option);
        }
        $('div.roomoption').append(roomoption[roomoption.length -1]);

    })

});