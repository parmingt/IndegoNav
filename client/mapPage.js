var userOrigin, startStation, endStation, userDestination;
var MAP_API_KEY = 'AIzaSyBijtQ6N5EHjeSfo4LTrACPhU793Yic13k';
var directionsService;
var startWalkRoute, bikeRoute, endWalkRoute;
var map;

var navigationTypes = {
    bike: 'BICYCLING',
    walk: 'WALKING'
}

getLocationsFromUrl();

function initMap() {
    directionsService = new google.maps.DirectionsService;
    startWalkRoute = new google.maps.DirectionsRenderer;
    bikeRoute = new google.maps.DirectionsRenderer;
    endWalkRoute = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: getMapCenter()
    });

    calculateAndDisplayRoute(userOrigin, startStation, navigationTypes.walk, startWalkRoute);
    calculateAndDisplayRoute(startStation, endStation, navigationTypes.bike, bikeRoute);
    calculateAndDisplayRoute(endStation, userDestination, navigationTypes.walk, endWalkRoute);
    
    startWalkRoute.setMap(map);
    bikeRoute.setMap(map);
    endWalkRoute.setMap(map);
}

// var originMarker = markLocation(userOrigin);
// var startStationMarker = markLocation(startStation);
// var endStationMarker = markLocation(endStation);
// var destinationMarker = markLocation(userDestination);

function getLocationsFromUrl() {
    var search = window.location.search.replace('?', '');
    var places = search.split('&');
    userOrigin = new MapLocation(null, places[0]);
    startStation = new MapLocation(null, places[1]);
    endStation = new MapLocation(null, places[2]);
    userDestination = new MapLocation(null, places[3]);
}

// function markLocation(location) {
//     return L.marker([location.coords.lat, location.coords.lng]).addTo(myMap);
// }

function calculateAndDisplayRoute(startLocation, endLocation, mode, renderer) {
    var directionsService = new google.maps.DirectionsService;
    var image = {
        url: 'https://maxcdn.icons8.com/Share/icon/Transport//bicycle1600.png',
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };

    renderer.setOptions(
        {
            polylineOptions: {
                strokeColor: mode === navigationTypes.bike ? 'blue' : 'yellow'
            },
            preserveViewport: true
        }
    );
    directionsService.route({
        origin: startLocation.coords.lat + ',' + startLocation.coords.lng,
        destination: endLocation.coords.lat + ',' + endLocation.coords.lng,
        travelMode: mode
    }, function(response, status) {
        if (status === 'OK') {
            renderer.setDirections(response);
        }
        else {
            window.alert(status);
        }
    });
}

function getMapCenter() {
    var allLocations = [userOrigin, startStation, endStation, userDestination];
    var minLat, maxLat, minLng, maxLng;
    allLocations.forEach(function (location) {
        var lat = location.coords.lat;
        var lng = location.coords.lng;

        if (lat < minLat || !minLat) {
            minLat = lat;
        }
        if (lat > maxLat || !maxLat) {
            maxLat = lat;
        }
        if (lng < minLng || !minLng) {
            minLng = lng;
        }   
        if (lng > maxLng || !maxLng) {
            maxLng = lng;
        }
    });

    return new google.maps.LatLng({lat: (maxLat + minLat) / 2, lng: (maxLng + minLng) / 2});
}