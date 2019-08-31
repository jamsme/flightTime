$(document).ready(function () {
    
    $("select").formSelect();

    var marker1;
    var marker2;
    var service;
    var serviceTwo
    var poly;
    var map;

    window.initMap = function() {
        
        var california = new google.maps.LatLng(37.0902, -102.7129);

        map = new google.maps.Map(document.getElementById('map'), {
            center: california,
            zoom: 5,
            disableDefaultUI: true
        });

        var request = {
            query: depart + "airport",
            fields: ['geometry'],
        };

        var requestTwo = {
            query: arrive + "airport",
            fields: ['geometry'],
        };

        service = new google.maps.places.PlacesService(map);
        serviceTwo = new google.maps.places.PlacesService(map);

        service.findPlaceFromQuery(request, function (results) {
            marker1 = new google.maps.Marker({
                map: map,
                draggable: true,
                position: results[0].geometry.location
            });

            serviceTwo.findPlaceFromQuery(requestTwo, function (results) {
                marker2 = new google.maps.Marker({
                    map: map,
                    draggable: true,
                    position: results[0].geometry.location
                });

                var bounds = new google.maps.LatLngBounds(
                    marker1.position, marker2.position);
                map.fitBounds(bounds);

                update();

            });
        });

        poly = new google.maps.Polyline({
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map: map,
        });
    };

    function update() {
        var path = [marker1.getPosition(), marker2.getPosition()];
        poly.setPath(path);
        var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
        var finaleHeading = Math.round(heading);
        document.getElementById('heading').value = finaleHeading;
        var d = google.maps.geometry.spherical.computeDistanceBetween(path[0], path[1]);
        var x = d / 1852;
        var finaleDistance = Math.round(x);
        document.getElementById('distance').value = finaleDistance;
      };
      
});