'use strict';

let qrCode = require('node-qrcode');
let fs = require('fs');
let path = require('path');
let logger = require('./../common/logger');
const QR_CODES_DIRECTORY = path.join('./', 'public', 'qr-codes');
const DEFAULT_IMAGE_EXTENSION = 'png';

class QrCodesService {
  getQrCodeForTouristSite(touristSiteId) {
    let that = this;
    let promise = new Promise(function (resolve, reject) {
        fs.readFile(that.getQrCodeFilePath(touristSiteId), function (err, file) {
          if (err) {
            logger.err(err);
            reject(err);
            return;
          }
          
          resolve(file);
        });
    });
    
    return promise;
  }
  
  createQrCode(touristSiteId) {
    let qrCodePath = this.getQrCodeFilePath(touristSiteId);
      return qrCode({
            text: touristSiteId,
            size: 150,
            qrcodePath: qrCodePath
      });
  }
  
  createQrCodesForAllTouristSites() {
    let that = this;
    let TouristSite = require('mongoose').model('TouristSite');
    let promise = new Promise(function (resolve, reject) {
        fs.readdir(QR_CODES_DIRECTORY, function(err, files) {
          TouristSite.find({isApprovedForVisiting: true}, '_id')
            .then(function(allTouristSites) {
              let promises = [];
              
              allTouristSites.forEach(function(touristSite) {
                let touristSiteFileName = `${touristSite._id}.${DEFAULT_IMAGE_EXTENSION}`;
                if (files.indexOf(touristSiteFileName) < 0) {
                  promises.push(that.createQrCode(touristSite._id));
                }
              });
              
              Promise.all(promises)
                .then(function (result) {
                  resolve('All QR Codes are created.');
                }, function (err) {
                  logger.err(err);
                  reject(err);
                });
              
            }, function (err) {
                logger.err(err);
                reject(err);
            });
        });
    });
    
    return promise;
  }
  
  getAllGeneratedQrCodesList() {
    let that = this;
    let promise = new Promise(function (resolve, reject) {
        fs.readdir(QR_CODES_DIRECTORY, function(err, files) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve(files);
        });
    });
    
    return promise;
  }
  
  getQrCodeFilePath(name) {
    return `${QR_CODES_DIRECTORY}/${name}.${DEFAULT_IMAGE_EXTENSION}`;
  }
}

module.exports = {
  QrCodesService: QrCodesService,
  defaultInstance: new QrCodesService()
};