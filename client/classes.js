var MapLocation = class{
    constructor(startValues, queryString) {
        if (startValues) {
            this.placeId = startValues.placeId;
            this.coords = {};
            if (startValues.coords) {
                this.coords = {
                    lat: startValues.coords ? startValues.coords.lat : null,
                    lng: startValues.coords ? startValues.coords.lng : null
                }
            }
        }
        else if (queryString) {
            this.placeId = queryString.split('=')[0];
            var coordinateString = queryString.split('=')[1];
            this.coords = {
                lat: coordinateString.split(',')[0],
                lng: coordinateString.split(',')[1]
            }
        }
    }

    getQueryString(parameterName) {
        return parameterName + '=' + this.coords.lat + ',' + this.coords.lng;
    }
}