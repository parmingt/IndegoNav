var MapLocation = class{
    constructor(startValues, queryString) {
        if (startValues) {
            this.placeId = startValues.placeId;
            this.coords = {};
            if (startValues.coords) {
                this.coords = {
                    lat: startValues.coords ? parseFloat(startValues.coords.lat) : null,
                    lng: startValues.coords ? parseFloat(startValues.coords.lng) : null
                }
            }
        }
        else if (queryString) {
            this.placeId = queryString.split('=')[0];
            var coordinateString = queryString.split('=')[1];
            this.coords = {
                lat: parseFloat(coordinateString.split(',')[0]),
                lng: parseFloat(coordinateString.split(',')[1])
            }
        }
    }

    getQueryString(parameterName) {
        return parameterName + '=' + this.coords.lat + ',' + this.coords.lng;
    }
}