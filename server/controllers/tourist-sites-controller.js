'use strict';
let TouristSite = require('mongoose').model('TouristSite');
let constants = require('./../common/constants');

module.exports = {
  addTouristSite: function(req, res) {
    let modelValidator = require('./../common/model-validator');
    let touristSite = req.body;

    if (!modelValidator.isTouristSiteRequestModelValid(touristSite)) {
      res.status(400)
        .json({
          message: 'Invalid tourist site registration data!'
        });

      return;
    }

    touristSite.ratings = [];
    touristSite.comments = [];
    touristSite.status = constants.TOURIST_SITE_STATUS_WAITING_FOR_APPROVAL;

    TouristSite.create(touristSite)
      .then(function(dbTouristSite) {
        res.status(201)
          .json({
            result: dbTouristSite
          });
      })
      .catch(function(err) {
        console.log(err);
        res.status(400)
          .json({
            message: 'The tourist site cannot be saved. The input data is not valid.'
          });
      });
  }
};
