'use strict';

const DEFAULT_RADIUS_IN_KILOMETERS = 5;
const DEFAULT_PAGE_SIZE = 10;
let TouristSite = require('mongoose').model('TouristSite');
let geopositionHelper = require('./../infrastructure/geoposition-helper.js').defaultInstance;
let constants = require('./../common/constants');

class TouristSitesServices {
  getAll() {
    let promise = new Promise(function(resolve, reject) {
      TouristSite.find({})
        .then(resolve, reject);
    });

    return promise;
  }

  getForPage(page, type, pageSize) {
    pageSize = pageSize || DEFAULT_PAGE_SIZE;

    let promise = new Promise(function(resolve, reject) {
      let query;

      if (type === constants.ALL_TOURIST_SITES_TYPE) {
        query = TouristSite.find({});
      } else if (type === constants.OFFICIAL_TOURIST_SITES_TYPE) {
        query = TouristSite.find({
          isOfficial: true
        });
      } else if (type === constants.UNOFFICIAL_TOURIST_SITES_TYPE) {
        query = TouristSite.find({
          isOfficial: false
        });
      }


      query = query.sort({
        title: 1
      })
        .skip(page * pageSize)
        .limit(pageSize);

      query.exec()
        .then(resolve, reject);
    });

    return promise;
  }

  addTouristSite(touristSite) {
    let promise = new Promise(function(resolve, reject) {
      touristSite.ratings = [];
      touristSite.comments = [];
      touristSite.status = constants.TOURIST_SITE_STATUS_WAITING_FOR_APPROVAL;

      TouristSite.create(touristSite)
        .then(resolve, reject);
    });

    return promise;
  }

  getTouristSitesNearMe(latitude, longitude, radius) {
    radius = radius || DEFAULT_RADIUS_IN_KILOMETERS;

    let deltaInLatitudeDegrees = geopositionHelper.calculateLatitudeDegreesFromRadiusInKilometers(radius);
    let deltaInLongitudeDegrees = geopositionHelper.calculateLongitudeDegreesFromRadiusInKilometers(latitude, radius);

    let minLatitude = latitude - deltaInLatitudeDegrees;
    let maxLatitude = latitude + deltaInLatitudeDegrees;
    let minLongitude = longitude - deltaInLongitudeDegrees;
    let maxLongitude = longitude + deltaInLongitudeDegrees;

    // Use lean() to be able to attach temporary property to mongoose object.
    let promise = new Promise(function(resolve, reject) {
      TouristSite.find()
        .where('latitude')
        .lt(maxLatitude)
        .gt(minLatitude)
        .where('longitude')
        .lt(maxLongitude)
        .gt(minLongitude)
        .lean()
        .exec(function(err, data) {
          if (err || !data) {
            reject(err);
            return;
          }

          let myPosition = {
            latitude,
            longitude
          };

          let result = [];

          data.forEach(function(item) {
            let distance = geopositionHelper.calculateDistanceInKilometers(myPosition, {
              latitude: item.latitude,
              longitude: item.longitude
            });

            if (distance <= radius) {
              item.distanceFromMe = +distance.toFixed(2);
              result.push(item);
            }
          });

          result.sort(function(first, second) {
            return first.distanceFromMe - second.distanceFromMe;
          });

          resolve(result);
        });
    });

    return promise;
  }
}

module.exports = {
  TouristSitesServices: TouristSitesServices,
  defaultInstance: new TouristSitesServices()
};