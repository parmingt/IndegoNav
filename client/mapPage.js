var userOrigin, startStation, endStation, userDestination;

getLocationsFromUrl();
var myMap = L.map('mapid').setView([userOrigin.coords.lat, userOrigin.coords.lng], 13);
var apiToken = 'pk.eyJ1IjoicGFybXl0YW5rIiwiYSI6ImNqNzJrY2l6cDAxbnQzM3RlMnd2cjRpd28ifQ.pWTPYPqvCSTDkPSTBMhXEg';

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + apiToken, {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(myMap);

var originMarker = markLocation(userOrigin);
var startStationMarker = markLocation(startStation);
var endStationMarker = markLocation(endStation);
var destinationMarker = markLocation(userDestination);

function getLocationsFromUrl() {
    var search = window.location.search.replace('?', '');
    var places = search.split('&');
    userOrigin = new MapLocation(null, places[0]);
    startStation = new MapLocation(null, places[1]);
    endStation = new MapLocation(null, places[2]);
    userDestination = new MapLocation(null, places[3]);
}

function markLocation(location) {
    return L.marker([location.coords.lat, location.coords.lng]).addTo(myMap);
}