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

    var comment = ["first comment : Unless she is more earnest in her studies, she will not be able to keep up with the class.",
        "second comment : By super express it will take you only three hours to go from Seoul to Busan.",
        "third comment : I read this book the other day and found it very interesting, so I will give it to you.", 
        "forth comment : Won't you go to that island with me if it is fine tomorrow afternoon? It takes about an hour by boat.",
        "fifth comment : What kind of dog will you keep, a watchdog or a pointer. I will keep a watchdog."];
    for(var j=0; j<comment.length; j++){
        var comm = comment[j];
        comm += '<br /><br />';
        $('div.comment_text').append(comm);
    }

    var description = "Spacious, bright and outward facing rooms measuring 19 m2 and totally refurbished. The room comes with Dreamax bed (manufactured and designed exclusively by Flex for Meliá Hotels International), a modern, fully equipped bathroom finished in top quality bronze coloured ceramics and an independent entrance. It also has a home automation system which automatically regulates the temperature of the room based on guest presence or absence from the room. They also provide an intelligent temperature management system that automatically adjusts the temperature depending on whether anyone is in the room.";
    $('div.description_text').append(description);

    var deposit = 1000000;
    $('div.deposit').append(deposit);
    $('div.deposit').append(' KRW');

    var monthly = 300000;
    $('div.monthly').append(monthly);
    $('div.monthly').append(' KRW');

    var roomtype = 'One-Room';
    $('div.roomtype').append(roomtype);

    var roomstatus = 'Available';
    $('div.roomstatus').append(roomstatus);

    var roomoption = 'wifi, fridge, bed';
    $('div.roomoption').append(roomoption);

});