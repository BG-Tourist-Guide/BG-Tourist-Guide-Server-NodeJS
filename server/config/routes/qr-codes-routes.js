'use strict';
let express = require('express');
let qrCodesController = require('./../../controllers/qr-codes-controller');
let identity = require('./../../common/identity');

module.exports = function(app) {
  let router = express.Router();

  router
    .get('/:id', qrCodesController.getQrCodeForTouristSite);

  app.use('/api/qr-codes', router);
};
