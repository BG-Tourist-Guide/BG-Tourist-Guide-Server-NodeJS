'use strict';
let modelValidator = require('./../common/model-validator');
let touristSites = require('./../services/tourist-sites-service.js').defaultInstance;

module.exports = {
  getAll: function(req, res) {
    touristSites.getAll()
      .then(function(data) {
        res.json({
          result: data
        });
      }, function(err) {
        res.status(400)
          .json(err);
      });
  },
  getForPage: function(req, res) {
    let page = +req.query.page || 1;
    let type = +req.query.type || 0;
    page -= 1;
    touristSites.getForPage(page, type)
      .then(function(data) {
        res.json({
          result: data
        });
      }, function(err) {
        res.status(400)
          .json(err);
      });
  },
  nearMe: function(req, res) {
    let latitude = +req.query.latitude;
    let longitude = +req.query.longitude;
    let radius = +req.query.radius;

    if (!latitude || !longitude) {
      res.status(400)
        .json({
          message: 'The latitude and the longitude are required to find the tourist sites near you.'
        });
      return;
    }

    touristSites.getTouristSitesNearMe(latitude, longitude, radius)
      .then(function(touristSitesNearMe) {
        console.log(touristSitesNearMe.length);
        res.json({
          result: touristSitesNearMe
        });
      });
  },
  addTouristSite: function(req, res) {
    let touristSite = req.body;

    if (!modelValidator.isTouristSiteRequestModelValid(touristSite)) {
      res.status(400)
        .json({
          message: 'Invalid tourist site registration data!'
        });

      return;
    }

    touristSites.addTouristSite(touristSite)
      .then(function(dbTouristSite) {
        res.status(201)
          .json({
            result: dbTouristSite
          });
      }, function(err) {
        console.log(err);
        res.status(400)
          .json({
            message: 'The tourist site cannot be saved. The input data is not valid.'
          });
      });
  },
  rateTouristSite(req, res) {
    let user = req.user;
    let ratingOptions = req.body;

    if (!modelValidator.isRateTouristSiteRequestModelValid(ratingOptions)) {
      res.status(400)
        .json({
          message: 'Invalid rate tourist site data!'
        });

      return;
    }

    touristSites.rateTouristSite(ratingOptions.id, user.userName, ratingOptions.value)
      .then(function(touristSite) {
        res.json({
          result: touristSite
        });
      });
  },
  visitTouristSite(req, res) {
    let user = req.user;
    let touristSiteId = req.body.touristSiteId;

    touristSites.visitTouristSite(touristSiteId, user)
      .then(function(visitedTouristSite) {
        console.log(visitedTouristSite);
        res.json({
          result: visitedTouristSite
        });
      }, function(err) {
        res.status(400)
          .json({
            message: err.message
          });
      });
  }
};
