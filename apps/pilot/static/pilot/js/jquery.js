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

        service.findPlaceFromQuery(request, function (result) {
            marker1 = new google.maps.Marker({
                map: map,
                position: result[0].geometry.location
            });

            serviceTwo.findPlaceFromQuery(requestTwo, function (results) {
                marker2 = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });

                var bounds = new google.maps.LatLngBounds(
                    marker1.position, marker2.position);
                    map.fitBounds(bounds);

                update();
                if (wind == "yes") {
                    getWeather(getLatLng(marker1)[0], getLatLng(marker1)[1]);
                } else {
                    eta(speed);
                    convertToHourMin(eta(speed));
                };
            });
        });

        poly = new google.maps.Polyline({
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map: map,
        });
    };

    var divide = Number; // Globally scoping "x"

    function update() {
        var path = [marker1.getPosition(), marker2.getPosition()];
        poly.setPath(path);
        var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
        if (heading < 0) {
            heading = heading + 360;
            heading
        }
        finaleHeading = Math.round(heading) + "°";
        document.getElementById('heading').value = finaleHeading;
        var d = google.maps.geometry.spherical.computeDistanceBetween(path[0], path[1]);
        divide = d / 1852;
        var finaleDistance = Math.round(divide) + "nm";
        document.getElementById('distance').value = finaleDistance;
      };

    function getWeather(x,y) {
        var request = new XMLHttpRequest()
        request.open('GET', `http://api.openweathermap.org/data/2.5/weather?lat=${x}&lon=${y}&appid=6f2782e4e065a6d3e06dbbbc35e40240`, true);
        request.onload = function () {
            var data = JSON.parse(this.response)
            if (request.status >= 200 && request.status < 400) {
                console.log(data);
              } else {
                console.log('error')
            }
        }
        request.send()
    };

    function eta(kts) {
        var round = Math.round(divide);
        var ete = round / kts;
        var multiply = ete * 60;
        var round = Math.round(multiply);
        return round; 
    };

    function convertToHourMin(mins) {
        let h = Math.floor(mins / 60);
        let m = mins % 60;
        document.getElementById('ete').value = `${h} hours ${m} minutes`;
    };

    function getLatLng(x) {
        var mark1 = String(x.getPosition());
        var remove = mark1.replace("(","");
        var remove2 = remove.replace(")","");
        var split = remove2.split(",");
        var latLng = [Number(split[0]), Number(split[1])];
        return latLng;
    };

});