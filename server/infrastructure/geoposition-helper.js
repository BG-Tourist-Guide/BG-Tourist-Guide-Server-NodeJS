'use strict';

const EARTH_RADIUS_IN_KILOMETERS = 6371;

class GeopositionHelper {
  calculateLatitudeDegreesFromRadiusInKilometers(radius) {
    let oneKilometerInLatitudeDegrees = 1 / 110.54;

    return radius * oneKilometerInLatitudeDegrees;
  }
  calculateLongitudeDegreesFromRadiusInKilometers(latitude, radius) {
    let oneKilometerInLongitudeDegrees = 1 / (111.320 * Math.cos(latitude * (Math.PI / 180)));

    return radius * oneKilometerInLongitudeDegrees;
  }

  calculateDistanceInKilometers(firstPosition, secondPosition) {
    // Formula source:
    // http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    
    let deltaLatitude = convertDegreesToRadians(secondPosition.latitude - firstPosition.latitude);
    let deltaLongitude = convertDegreesToRadians(secondPosition.longitude - firstPosition.longitude);

    let sinusHalfDeltaLatitude = Math.sin(deltaLatitude / 2);
    let sinusHalfDeltaLongitude = Math.sin(deltaLongitude / 2);

    let a = Math.pow(sinusHalfDeltaLatitude, 2) +
      Math.cos(convertDegreesToRadians(firstPosition.latitude)) *
      Math.cos(convertDegreesToRadians(secondPosition.latitude)) *
      Math.pow(sinusHalfDeltaLongitude, 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = EARTH_RADIUS_IN_KILOMETERS * c;

    return distance;
  }
}

function convertDegreesToRadians(degrees) {
  let radians = degrees * (Math.PI / 180);

  return radians;
}

module.exports = {
  GeopositionHelper: GeopositionHelper,
  defaultInstance: new GeopositionHelper()
};