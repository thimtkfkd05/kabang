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

  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

$(document).ready(function(){
    $("#add").on("click", function(){
      $("#dynamicCB").append("<br/><div class = 'form-check'><input class='form-check-input' type='radio' name= 'wifi' value ='Wifi'><label class = 'form-check-lable' for='wifi'>Wifi</label>")
    })});

// 이미지 정보들을 담을 배열
var sel_files = [];
var index = 0;
var fileNameArr = new Array();


$(document).ready(function() {
    $("#input_imgs").on("change", handleImgFileSelect);
    $("#input_imgs").on("change", function(){
      fileNameArr.push($('#input_imgs').val());
    });
}); 

function fileUploadAction() {
    console.log("fileUploadAction");
    $("#input_imgs").trigger('click');
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

        sel_files.push(f);

        var reader = new FileReader();
        reader.onload = function(e) {
            var html = "<a href=\"javascript:void(0);\" onclick=\"deleteImageAction("+index+")\" id=\"img_id_"+index+"\"><img src=\"" + e.target.result + "\" data-file='"+f.name+"' class='selProductFile' title='Click to remove'></a>";
            $(".imgs_wrap").append(html);
            $(".imgs_wrap").append(index);
            index++;
        }
        reader.readAsDataURL(f);
        
    });
}
$(document).ready(function() {
  $('#btnSave').click(function() {
      addCheckbox($('#txtName').val());
  });
});
var optionNum;
function addCheckbox(name) {
 var container = $('#cblist');
 var inputs = container.find('input');
 optionNum = inputs.length+1;

 $('<input />', { type: 'checkbox', id: 'cb'+ optionNum, value: name }).appendTo(container);
 $('<label />', { 'for': 'cb'+ optionNum, text: name }).appendTo(container);
}




$(document).ready(function() {    
$('#register').click(function(){
var chkedArr = new Array;
$("input:checkbox:checked").each(function(index){
  chkedArr.push($(this).val());
})

var location_obj = {
  lat : myMarker.position.lat,
  lng : myMarker.position.lng,
}

    
$.post('/register_room',{
  deposit : $('#deposit').val(),
  monthly : $('#monthly').val(),
  status : $('#status').val(),
  option : chkedArr,
  description : $('#description').val(),
  type : $('#type').val(), 
  picture : fileNameArr,
 location : location_obj,
  enrolled_date : new Date().toISOString()},
  

  function(result){
  if(result){
    alert("Success!!");
  }
  else{
    alet("Register Faii!!");
  }
  });});}); 

  

  

