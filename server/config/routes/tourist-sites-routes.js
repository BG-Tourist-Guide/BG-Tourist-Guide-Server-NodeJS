'use strict';
let express = require('express');
let touristSitesController = require('./../../controllers/tourist-sites-controller');
let identity = require('./../../common/identity');

module.exports = function(app) {
  let router = express.Router();

  router
    .get('/', touristSitesController.getAll)
    .post('/', identity.requiresAuthentication(), touristSitesController.addTouristSite);

  app.use('/api/tourist-sites', router);
};
