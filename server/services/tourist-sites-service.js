'use strict';

const DEFAULT_RADIUS_IN_KILOMETERS = 5;
const DEFAULT_PAGE_SIZE = 10;
let mongoose = require('mongoose');
let TouristSite = mongoose.model('TouristSite');
let usersService = require('./users-service').defaultInstance;
let geopositionHelper = require('./../infrastructure/geoposition-helper.js').defaultInstance;
let constants = require('./../common/constants');

class TouristSitesService {
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
          isOfficial: true,
          isApprovedForVisiting: true
        });
      } else if (type === constants.UNOFFICIAL_TOURIST_SITES_TYPE) {
        query = TouristSite.find({
          isOfficial: false,
          isApprovedForVisiting: true
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
      TouristSite.find({
        isApprovedForVisiting: true
      })
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

  rateTouristSite(id, author, rateValue) {
    let promise = new Promise(function(resolve, reject) {
      let rating = {
        value: rateValue,
        author
      };

      TouristSite.findById(id)
        .then(function(touristSite) {
          touristSite.ratings.push(rating);
          return touristSite.save();
        }, reject)
        .then(function(touristSite) {
          resolve(touristSite);
        }, reject);
    });

    return promise;
  }

  visitTouristSite(touristSiteId, user) {
    let promise = new Promise(function(resolve, reject) {
      let userHasVisitedTouristSite = user.visitedTouristSites.filter((item) => {
        return item.userName === user.userName;
      }).length > 0;

      if (userHasVisitedTouristSite) {
        reject({
          message: 'The tourist site was already visited by you.'
        });

        return;
      }

      TouristSite.findById(touristSiteId)
        .then(function(dbTouristSite) {
          usersService.visitTouristSite(dbTouristSite, user)
            .then(function(dbUser) {
              if (!dbTouristSite.visitors) {
                dbTouristSite.visitors = [];
              }

              let visitor = {
                userName: user.userName,
                dateOfVisit: Date.now()
              };

              dbTouristSite.visitors.push(visitor);

              dbTouristSite.save(function(err) {
                if (err) {
                  reject(err);
                  return;
                }

                resolve(dbTouristSite);
              }, reject);
            }, reject);
        });
    });

    return promise;
  }
}

module.exports = {
  TouristSitesService: TouristSitesService,
  defaultInstance: new TouristSitesService()
};