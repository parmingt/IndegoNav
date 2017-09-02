var userOrigin, startStation, endStation, userDestination;
var MAP_API_KEY = 'AIzaSyBijtQ6N5EHjeSfo4LTrACPhU793Yic13k';
var directionsService;
var startWalkRoute, bikeRoute, endWalkRoute;

getLocationsFromUrl();

function initMap() {
    directionsService = new google.maps.DirectionsService;
    startWalkRoute = new google.maps.DirectionsRenderer;
    bikeRoute = new google.maps.DirectionsRenderer;
    endWalkRoute = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });
    startWalkRoute.setMap(map);
    bikeRoute.setMap(map);
    endWalkRoute.setMap(map);

    calculateAndDisplayRoute(userOrigin, startStation, "WALKING", startWalkRoute);
    calculateAndDisplayRoute(startStation, endStation, "BICYCLING", bikeRoute);
    calculateAndDisplayRoute(endStation, userDestination, "WALKING", endWalkRoute);
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