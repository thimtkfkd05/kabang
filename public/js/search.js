var myMarker;

function initMap() {
    
  var seoul = {lat: 37, lng: 126};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15, center: seoul});

  myMarker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: seoul,
    title: 'My Location',          
  });
  
  var infoWindow = new google.maps.InfoWindow({map: map});
        
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    map.setCenter (pos);
    myMarker.setPosition (pos);          
    }, function () {
      handleError (true, infoWindow, map.getCenter()); 
    });

  } else {
      //Browser does not support Geo
      handleError (false, infoWindow, map.getCenter());
  }
  
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

$(document).ready(function() {
  $("#search").click(function(){
   
    var room_type;
    var query = '/roomlist?';
    query += 'lat=' + myMarker.getPosition ().lat () + '&';
    query += 'lng=' + myMarker.getPosition ().lng () + '&';
    query += 'd_min=' + $('#d-min').val() + '&';
    query += 'd_max=' + $('#d-max').val() + '&';
    query += 'm_min=' + $('#m-min').val() + '&';
    query += 'm_max=' + $('#m-max').val() + '&';
    
    if ($("#one-room-1").is(":checked"))
      room_type = "one-room-1";
    else if ($("#one-room-2").is(":checked"))
      room_type = "one-room-2";
    else if ($("#two-room").is(":checked"))
      room_type = "two-room";
    else if ($("#three-room").is(":checked"))
      room_type = "three-room";
    
    query += 'room_type=' + room_type;
    console.log(query);

    window.location.href = query;
    /*
    //code for asking room search
    $.post ('/searchRoom', {
      lat : myMarker.getPosition ().lat(),
      lng : myMarker.getPosition ().lng(),
      room_type : room_type,
      room_price_d_min : room_price_d_min,
      room_price_d_max : room_price_d_max,
      room_price_m_min : room_price_m_min,
      room_price_m_max : room_price_m_max
    }, function (data){
      
      console.log (data);
      
    }); */

  });


  $('#cancel').click (function (){
    console.log ("cancel clicked");
    window.location.href = '/mypage';
  });
});
