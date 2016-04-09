'use strict';
let qrCodes = require('./../services/qr-codes-service.js').defaultInstance;
let constants = require('./../common/constants');
let identity = require('./../common/identity');

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
  },
  generateQrCodesForAllTouristSites(req, res) {
    let user = req.user;
    let isUserAdmin = identity.isAuthorizedForRole(user, constants.ADMIN_ROLE);
    
    if (!isUserAdmin) {
      res.status(401)
        .json({
          message: 'You are not authorized to do this!'
        });
        
        return;
    }
    
    qrCodes.createQrCodesForAllTouristSites()
      .then(function(data) {
        res.status(201)
          .json({
            result: data
          });
      }, function(err) {
        res.status(500)
          .json(err);
      });
  },
  getAllGeneratedQrCodesList(req, res) {
    let user = req.user;
    let isUserAdmin = identity.isAuthorizedForRole(user, constants.ADMIN_ROLE);
    
    if (!isUserAdmin) {
      res.status(401)
        .json({
          message: 'You are not authorized to do this!'
        });
        
        return;
    }
    
    qrCodes.getAllGeneratedQrCodesList()
      .then(function(data) {
        res.status(200)
          .json({
            result: data
          });
      }, function(err) {
        res.status(500)
          .json(err);
      });
  }
};
