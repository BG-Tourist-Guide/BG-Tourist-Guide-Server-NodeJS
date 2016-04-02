'use strict';

const DEFAULT_RADIUS_IN_KILOMETERS = 5;
const DEFAULT_PAGE_SIZE = 10;
let mongoose = require('mongoose');
let TouristSite = mongoose.model('TouristSite');
let usersService = require('./users-service').defaultInstance;
let constants = require('./../common/constants');

class TouristSitesService {
  getCommentsForTouristSite(touristSiteId, page, pageSize) {
    pageSize = pageSize || DEFAULT_PAGE_SIZE;

    let promise = new Promise(function(resolve, reject) {
      let query;

      TouristSite.findById(touristSiteId)
        .then(function(dbTouristSite) {
          if (!dbTouristSite.comments) {
            dbTouristSite.comments = [];
          }

          let skip = page * pageSize;
          let result = dbTouristSite.comments.splice(skip, pageSize);

          resolve(result);
        });
    });

    return promise;
  }

  createComment(touristSiteId, comment) {
    let promise = new Promise(function(resolve, reject) {
      TouristSite.findById(touristSiteId)
        .then(function(dbTouristSite) {
          if (!dbTouristSite.comments) {
            dbTouristSite.comments = [];
          }
          
          dbTouristSite.comments.push(comment);

          dbTouristSite.save(function(err, savedTouristSite) {
            if (err) {
              console.log(err);
              reject(err);
              return;
            }
            
            resolve(savedTouristSite);
          });
        }, reject);
    });

    return promise;
  }
}

module.exports = {
  TouristSitesService: TouristSitesService,
  defaultInstance: new TouristSitesService()
};