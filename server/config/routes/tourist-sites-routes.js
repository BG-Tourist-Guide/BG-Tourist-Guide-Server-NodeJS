'use strict';
let express = require('express');
let touristSitesController = require('./../../controllers/tourist-sites-controller');
let identity = require('./../../common/identity');

module.exports = function(app) {
  let router = express.Router();

  router
    .post('/', touristSitesController.addTouristSite);

  app.use('/api/tourist-sites', router);
};
