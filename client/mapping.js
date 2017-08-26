$(document).ready(function(){
    getPosition(function (position) {
        $('#startLocationInput').val(formatPosition(position));
        origin = new MapLocation({
            coords: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        });
    });

    $('#endLocationInput').focus(biasAutocomplete);
    $('#getRouteButton').click(function () {
        getClosestStations();
        window.open(buildMapUrl());
        return false;
    });
});

var autocomplete;
var MAP_API_KEY = 'AIzaSyBijtQ6N5EHjeSfo4LTrACPhU793Yic13k';
var destination;
var origin;
var stationLocations = [];
var startStation, endStation;

function getPosition(callback) {
    if (navigator.geolocation && callback) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var location = formatPosition(position);
            callback(position);
        });
    }
}

function formatPosition(position) {
    return 'Lat: ' + position.coords.latitude + ', Lon: ' + position.coords.longitude; 
}

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('endLocationInput'),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', setDestination);
}

function setDestination() {
    var place = autocomplete.getPlace();
    destination = new MapLocation({
        placeId: place.place_id,
        coords: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        }
    });
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function biasAutocomplete() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

var MapLocation = class{
    constructor(startValues) {
        this.placeId = startValues.placeId;
        this.coords = {};
        if (startValues.coords) {
            this.coords = {
                lat: startValues.coords ? startValues.coords.lat : null,
                lng: startValues.coords ? startValues.coords.lng : null
            }
        }
    }
}

// Request bike stations
$.ajax({
  url: 'https://www.rideindego.com/stations/json/',
  method: 'GET',
}).done(function(response) {
    stationLocations = response.features;
});

function getDistance(mapLocation, bikeStation) {
    return Math.abs(mapLocation.coords.lat - bikeStation.geometry.coordinates[1]) + Math.abs(mapLocation.coords.lng - bikeStation.geometry.coordinates[0]);
}

function getClosestStations() {
    var startWalkDistance, endWalkDistance;
    stationLocations.forEach(function (station) {
        if (!startWalkDistance || getDistance(origin, station) < startWalkDistance) {
            startWalkDistance = getDistance(origin, station);
            startStation = station;
        }
        if (!endWalkDistance || getDistance(destination, station) < endWalkDistance) {
            endWalkDistance = getDistance(destination, station);
            endStation = station;
        }
    });
    console.log(startStation, endStation);
}

function buildMapUrl() {
    var url = 'https://www.google.com/maps/dir/?api=1';

    url += '&origin=' + startStation.geometry.coordinates[1] + ',' + startStation.geometry.coordinates[0];
    url += '&destination=' + endStation.geometry.coordinates[1] + ',' + endStation.geometry.coordinates[0];

    url += '&travelmode=bicycling';

    return url;
}