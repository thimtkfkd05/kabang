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
}

function handleError (hasGeo, infoWindow, pos) {
  infoWindow.setPosition (pos);
  infoWindow.setContent(hasGeo ? 'Error: Geo service failed.':'Error: browser not support geo');
}

$(document).ready(function() {
  $("#search").click(function(){
    
    if ($("#one-room-1").is(":checked"))
      console.log("one-room-1");
    else if ($("#one-room-2").is(":checked"))
      console.log("one-room-2");     
    else if ($("#two-room").is(":checked"))
      console.log("two-room");
  });
});
//var dist = google.maps.geometry.spherical.computeDistanceBetween(event.latLng, myMarker.getPosition());