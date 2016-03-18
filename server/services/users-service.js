'use strict';

const DEFAULT_RADIUS_IN_KILOMETERS = 5;
const DEFAULT_PAGE_SIZE = 10;
let mongoose = require('mongoose');
let User = mongoose.model('User');
let constants = require('./../common/constants');

class UsersServices {
  visitTouristSite(touristSite, user) {
    let promise = new Promise(function(resolve, reject) {
      User.findById(user._id)
        .then(function(dbUser) {
          if (!dbUser.visitedTouristSites) {
            dbUser.visitedTouristSites = [];
          }

          let visit = {
            touristSiteId: touristSite._id,
            dateOfVisit: Date.now()
          };

          dbUser.visitedTouristSites.push(visit);

          if (!dbUser.score) {
            dbUser.score = 0;
          }

          if (touristSite.isOfficial) {
            dbUser.score += constants.OFFICIAL_TOURIST_SITE_VISIT_POINTS;
          }
          else {
            dbUser.score += constants.UNOFFICIAL_TOURIST_SITE_VISIT_POINTS;
          }

          dbUser.save(function(err) {
            if (err) {
              reject(err);
              return;
            }

            resolve(dbUser);
          });
        }, reject);
    });

    return promise;
  }
}

module.exports = {
  UsersServices: UsersServices,
  defaultInstance: new UsersServices()
};