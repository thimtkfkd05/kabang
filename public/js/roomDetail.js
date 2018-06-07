var marker; var map;
function initMap() {
    
    var seoul = {lat: 37, lng: 126};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15, center: seoul});
  
    myMarker = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: seoul,
      title: 'My Location',          
    });
    
    // var infoWindow = new google.maps.InfoWindow({map: map});
          
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //   var pos = {
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude
    //   };
  
    //   map.setCenter (pos);
    //   myMarker.setPosition (pos);          
    //   }, function () {
    //     handleError (true, infoWindow, map.getCenter()); 
    //   });
  
    // } else {
    //     //Browser does not support Geo
    //     handleError (false, infoWindow, map.getCenter());
    // }
    
    /*
    google.maps.event.addListener (map, 'click', function (e){
      
      var myPos = myMarker.getPosition ();
      var d = 0.0035
      var point = new google.maps.LatLng(myPos.lat() - d, myPos.lng() + d);    
      var dist = google.maps.geometry.spherical.computeDistanceBetween(point, myPos);
      
      console.log (dist);
    }); */
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

    var pos = {
        'lat': Number($('#location .lat').text()),
        'lng': Number($('#location .lng').text())
    };
    var interval = setInterval(function() {
        if (map && pos.lat && pos.lng) {
            map.setCenter (pos);
            myMarker.setPosition (pos);
            clearInterval(interval);
        }
    }, 1000);
});

$(document).on('click', '.subimg', function() {
    $('#img').attr('src', $(this).attr('src'));
});