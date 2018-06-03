var marker;

function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    var image = {
    url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    };

    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
    });
    
    marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: uluru,
    title: 'uluru',
    icon: image
    });
        
    marker.addListener('click', toggleBounce); 
    
    var infoWindow = new google.maps.InfoWindow({map: map});
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found. ');
        map.setCenter (pos);
        marker.setPosition (pos);
    }, function () {
        handleError (true, infoWindow, map.getCenter());
    });
    } else {
    //Browser does not support Geo
    handleError (false, infoWindow, map.getCenter());
    }

}

function handleError (hasGeo, infoWindow, pos) {
    infoWindow.setPosition (pos);
    infoWindow.setContent(hasGeo ? 'Error: Geo service failed.':'Error: browser not support geo');
}

function toggleBounce() {
    if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
    } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

$(document).ready(function(){
    // $.get('/detailRoom',{},function(res){

    //     var room_info = res.result;

    //     var roomimg = function(img) {
    //         return [
    //             '<img id="subimg" src="',img,'" class="img-thumbnail" alt="etc img" style="width: 100px; height: 100px; object-fit: contain;">',   
    //         ].join('');
    //     };

    //     var room_img = room_info.picture;
    //     for(var i=0; i<room_img.length; i++){
    //         var html = roomimg(room_img[i]);
    //         $('div.room_img_btn').append(html);
    //     };
    
    //     var comment = room_info.comments;
    //     for(var j=0; j<comment.length; j++){
    //         var comm = comment[j];
    //         comm += '<br /><br />';
    //         $('div.comment_text').append(comm);
    //     }

    //     var description = room_info.description;
    //     $('div.description_text').append(description);

    //     var deposit = room_info.deposit;
    //     $('div.deposit').append(deposit);
    //     $('div.deposit').append(' KRW');

    //     var monthly = room_info.monthly;
    //     $('div.monthly').append(monthly);
    //     $('div.monthly').append(' KRW');

    //     var roomtype = room_info.type;
    //     $('div.roomtype').append(roomtype);

    //     var roomstatus = room_info.status;
    //     $('div.roomstatus').append(roomstatus);

    //     var roomoption = room_info.option;
    //     for(var k=0; k<roomoption.length -1; k++){
    //         var option = roomoption[k];
    //         option += ', ';
    //         $('div.roomoption').append(option);
    //     }
    //     $('div.roomoption').append(roomoption[roomoption.length -1]);

    // })

    $('#send_request').click(function() {
        $.post('/sendRequest', {
            room_id: $('#room_id').text()
        }, function(result) {
            if (result.err || !result.result) {
                alert('Send Request Failed! Try Again.');
            } else {
                alert('Send Request Success!');
            }
        });
    });
});

$(document).on('click', '.img-thumbnail', function() {
	$('#img').attr('src', $(this).attr('src'));
});