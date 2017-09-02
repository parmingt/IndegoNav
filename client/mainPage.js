var originAutocomplete, destinationAutocomplete;
var MAP_API_KEY = 'AIzaSyBijtQ6N5EHjeSfo4LTrACPhU793Yic13k';
var userDestination;
var userOrigin;
var stationLocations = [];
var startStation, endStation;
var currentLocationInput = "Current Location";

$(document).ready(function(){
    $('#startLocationInput').val(currentLocationInput);

    $('#startLocationInput').focus(function () {
        $(this).select();
        biasAutocomplete(originAutocomplete);
    });
    $('#endLocationInput').focus(function () {
        biasAutocomplete(destinationAutocomplete);
    });
    $('#getRouteButton').click(function () {
        onGetRouteClick();
    });
});

function getOriginFromDevice(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userOrigin = new MapLocation({
                coords: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            });
            if (callback) {
                callback();
            }
        });
    }
    else {
        alert('Cannot get device location');
    }
}

function formatPosition(position) {
    return position.coords.latitude + ', ' + position.coords.longitude;
}

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    originAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('startLocationInput'),
        {types: ['geocode']});
    destinationAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('endLocationInput'),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    originAutocomplete.addListener('place_changed', setOrigin);
    destinationAutocomplete.addListener('place_changed', setDestination);
}

function setOrigin() {
    var place = originAutocomplete.getPlace();
    userOrigin = new MapLocation({
        placeId: place.place_id,
        coords: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        }
    });
}

function setDestination() {
    var place = destinationAutocomplete.getPlace();
    userDestination = new MapLocation({
        placeId: place.place_id,
        coords: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        }
    });
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function biasAutocomplete(inputAutocomplete) {
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
            inputAutocomplete.setBounds(circle.getBounds());
        });
    }
}

// Request bike stations
$.ajax({
  url: 'https://www.rideindego.com/stations/json/',
  method: 'GET',
}).done(function(response) {
    stationLocations = response.features;
});

function onGetRouteClick() {
    if ($('#startLocationInput').val() === currentLocationInput) {
        getOriginFromDevice(function () {
            getClosestStations();
            goToMapPage();
            //window.open(buildMapUrl());
        });
    }
    else {
        getClosestStations();
        goToMapPage();
        //window.open(buildMapUrl());
    }
}

function getDistanceFromBikeStation(mapLocation, bikeStation) {
    return Math.abs(mapLocation.coords.lat - bikeStation.geometry.coordinates[1]) + Math.abs(mapLocation.coords.lng - bikeStation.geometry.coordinates[0]);
}

function getClosestStations() {
    var startWalkDistance, endWalkDistance;
    var startStationCoords, endStationCoords;
    stationLocations.forEach(function (station) {
        if (station.properties.bikesAvailable === 0) {
            return;
        }
        if (!startWalkDistance || getDistanceFromBikeStation(userOrigin, station) < startWalkDistance) {
            startWalkDistance = getDistanceFromBikeStation(userOrigin, station);
            startStationCoords = station;
        }
        if (!endWalkDistance || getDistanceFromBikeStation(userDestination, station) < endWalkDistance) {
            endWalkDistance = getDistanceFromBikeStation(userDestination, station);
            endStationCoords = station;
        }
    });
    startStation = new MapLocation({
        coords: {
            lat: startStationCoords.geometry.coordinates[1],
            lng: startStationCoords.geometry.coordinates[0]
        }}
    );
    endStation = new MapLocation({
        coords: {
            lat: endStationCoords.geometry.coordinates[1],
            lng: endStationCoords.geometry.coordinates[0]
        }}
    );
}

function buildMapUrl() {
    var url = 'https://www.google.com/maps/dir/?api=1';

    url += '&origin=' + startStation.geometry.coordinates[1] + ',' + startStation.geometry.coordinates[0];
    url += '&destination=' + endStation.geometry.coordinates[1] + ',' + endStation.geometry.coordinates[0];

    url += '&travelmode=bicycling';

    return url;
}

function goToMapPage() {
    var url = '/map?';
    url += [userOrigin.getQueryString('start'), startStation.getQueryString('station1'), endStation.getQueryString('station2'), userDestination.getQueryString('end')].join('&');

    window.location.replace(url)
}