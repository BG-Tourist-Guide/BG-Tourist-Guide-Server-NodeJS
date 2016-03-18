'use strict';
let express = require('express');
let touristSitesController = require('./../../controllers/tourist-sites-controller');
let identity = require('./../../common/identity');

module.exports = function (app) {
  let router = express.Router();

  router
    .get('/', touristSitesController.getForPage)
    .get('/all', touristSitesController.getAll)
    .get('/near-me', touristSitesController.nearMe)
    .post('/rate', identity.requiresAuthentication(), touristSitesController.rateTouristSite)
    .put('/visit', identity.requiresAuthentication(), touristSitesController.visitTouristSite);

  app.use('/api/tourist-sites', router);
};
