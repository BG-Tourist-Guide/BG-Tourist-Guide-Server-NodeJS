'use strict';
let qrCodes = require('./../services/qr-codes-service.js').defaultInstance;

module.exports = {
  getQrCodeForTouristSite(req, res) {
    let touristSiteId = req.params.id;
    qrCodes.getQrCodeForTouristSite(touristSiteId)
      .then(function (qrCodeImage) {
        res.end(qrCodeImage, 'image/png');
      }, function (err) {
        res.status(404)
          .json(err);
      });
  }
};
