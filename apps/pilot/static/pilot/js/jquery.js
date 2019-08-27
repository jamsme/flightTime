$(document).ready(function() {

    $("select").formSelect();

    var map;
    window.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 37.0902, lng: -95.7129},
            zoom: 3.5,
            disableDefaultUI: true
        });
    }
    
});