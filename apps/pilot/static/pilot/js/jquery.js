$(document).ready(function () {

    console.log(depart, arrive);

    $("select").formSelect();

    var map;
    var service;
    var infowindow;

    window.initMap = initMap;

    function initMap() {
        var california = new google.maps.LatLng(37.0902, -102.7129);

        infowindow = new google.maps.InfoWindow();

        map = new google.maps.Map(document.getElementById('map'), {
            center: california,
            zoom: 4,
            disableDefaultUI: true
        });

        var request = {
            query: depart + "airport",
            fields: ['name', 'geometry'],
        };

        service = new google.maps.places.PlacesService(map);

        service.findPlaceFromQuery(request, function (results) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }

            var latLngArrive = results[0].geometry.location;
        });

        var requestTwo = {
            query: arrive + "airport",
            fields: ['name', 'geometry'],
        };

        service.findPlaceFromQuery(requestTwo, function (results) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
                // console.log(results[i].geometry.location.lat);
            }

            var latLngDepart = results[0].geometry.location;

        });

        function createMarker(place) {
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        }
    };

});