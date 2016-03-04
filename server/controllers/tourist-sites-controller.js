'use strict';
let modelValidator = require('./../common/model-validator');
let touristSites = require('./../services/tourist-sites-service.js').defaultInstance;

module.exports = {
  getAll: function (req, res) {
    touristSites.getAll({})
      .then(function (data) {
        res.json({
          result: data
        });
      }, function (err) {
        res.json(400, err);
      });
  },
  nearMe: function (req, res) {
    let latitude = +req.query.latitude;
    let longitude = +req.query.longitude;
    let radius = +req.query.radius;

    if (!latitude || !longitude) {
      res.json(400, {
        message: 'The latitude and the longitude are required to find the tourist sites near you.'
      });
      return;
    }

    touristSites.getTouristSitesNearMe(latitude, longitude, radius)
      .then(function (touristSitesNearMe) {
        console.log(touristSitesNearMe.length);
        res.json({
          result: touristSitesNearMe
        });
      });
  },
  addTouristSite: function (req, res) {
    let touristSite = req.body;

    if (!modelValidator.isTouristSiteRequestModelValid(touristSite)) {
      res.json(400, {
        message: 'Invalid tourist site registration data!'
      });

      return;
    }

    touristSites.addTouristSite(touristSite)
      .then(function (dbTouristSite) {
        res.json(201, {
          result: dbTouristSite
        });
      }, function (err) {
        console.log(err);
        res.json(400, {
          message: 'The tourist site cannot be saved. The input data is not valid.'
        });
      });
  }
};
