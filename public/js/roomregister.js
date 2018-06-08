var myMarker;
var geocoder;
var map;

function initMap() {
    
  var seoul = {lat: 37, lng: 126};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15, center: seoul});

  geocoder = new google.maps.Geocoder;
  myMarker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: seoul,
    title: 'My Location',          
  });
  
  var infoWindow = new google.maps.InfoWindow({map: map});

  if ($('#location .lat') && $('#location .lat').text()) {
    var pos = {
      lat: Number($('#location .lat').text()),
      lng: Number($('#location .lng').text())
    };

    map.setCenter (pos);
    myMarker.setPosition (pos);
  } else if (navigator.geolocation) {
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

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// 이미지 정보들을 담을 배열
var fileNameArr = [];

$(document).ready(function() {
  $("#input_imgs").on("change", handleImgFileSelect);
}); 

function fileUploadAction() {
    $("#input_imgs").click();
}

function handleImgFileSelect(e) {
    // 이미지 정보들을 초기화

  var files = e.target.files;
  var filesArr = Array.prototype.slice.call(files);
  
  filesArr.forEach(function(f) {
    if(!f.type.match("image.*")) {
      alert("확장자는 이미지 확장자만 가능합니다.");
      return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
      var index = fileNameArr.length;
      var html = "<a onclick=\"deleteImageAction("+index+")\" id=\"img_id_"+index+"\"><img src=\"" + e.target.result + "\" data-file='"+f.name+"' class='selProductFile' ></a>";
      $(".imgs_wrap").append(html);
      fileNameArr.push(e.target.result);
    };
    reader.readAsDataURL(f);
  });
};

function deleteImageAction(index) {
  fileNameArr.splice(index, 1);
  $('#img_id_'+index).remove();
};

var optionNum;
function addCheckbox(name) {
 var container = $('#cblist');
 var inputs = container.find('input');
 optionNum = inputs.length+1;
 
 $('<input />', { type: 'checkbox', id: 'cb'+ optionNum, value: name }).appendTo(container);
 $('<label />', { 'for': 'cb'+ optionNum, text:  name}).appendTo(container);
}

function getRoomInfo(next) {
  var chkedArr = new Array;
  $("input:checkbox:checked").each(function(index){
    chkedArr.push($(this).val());
  })

  var location_obj = {
    lat : myMarker.getPosition().lat(),
    lng : myMarker.getPosition().lng(),
  }

  var geocoder = new google.maps.Geocoder;

  geocoder.geocode ({'location': location_obj}, function (results, status){
    if (status == 'OK') {
      if (results[1]) {
        return next({
          address : results[1].formatted_address,
          deposit : $('#deposit').val(),
          monthly : $('#monthly').val(),
          status : $('#status').val(),
          option : chkedArr,
          description : $('#description').val(),
          type : $('#type').val(), 
          picture : fileNameArr,
          location : location_obj,
          enrolled_date : new Date().toISOString()
        });
      } else {
        console.log ('No results found');
        return next(null);
      }
    } else {
      console.log ("Geocoder failed due to: " + status);
      return next(null);
    }
  });
};

$(document).ready(function() {
  $('#btnSave').click(function() {
    if ($('#txtName').val()) {
      addCheckbox($('#txtName').val());
    }
  });
  $('#register').click(function(){
    getRoomInfo(function(room_info) {
      if (room_info) {
        $.post('/register_room', room_info, function(result){
          if(result){
            alert("Register Success!!");
            location.href = '/mypage';
          } else {
            alet("Register Fail!!");
            location.reload();
          }
        });
      } else {
        alert("Register Fail!!");
        location.reload();
      }
    });
  });

  $('#edit').click(function(){
    var room_id = $(this).data('room-id');
    getRoomInfo(function(room_info) {
      if (room_info && room_id) {
        $.post('/register_room/'+room_id, room_info, function(result){
          if(result){
            alert("Edit Success!!");
            location.href = '/mypage';
          } else {
            alet("Edit Fail!!");
            location.reload();
          }
        });
      } else {
        alert("Edit Fail!!");
        location.reload();
      }
    });
  });

  $('#delete').click(function() {
    var room_id = $(this).data('room-id');
    
    $.post('/delete_room', {
      room_id: room_id
    }, function(result) {
      if (result) {
        alert("Delete Success!");
        location.href = '/mypage';
      } else {
        alert("Delete Fail!");
        location.reload();
      }
    });
  });
});