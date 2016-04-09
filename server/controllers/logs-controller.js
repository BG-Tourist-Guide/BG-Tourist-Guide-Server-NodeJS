'use strict';
let identity = require('./../common/identity');
let constants = require('./../common/constants');
let logger = require('./../common/logger');
let logs = require('./../services/logs-service').defaultInstance;

module.exports = {
  getMessages: function(req, res) {
    logs.getMessages()
      .then(function(logsResult) {
        res.json({
          result: logsResult
        });
      }, function(err) {
        res.status(500)
          .json({
            message: err.message || err 
          });
      });
  },
  getErrors: function(req, res) {
    logs.getErrors()
      .then(function(logsResult) {
        res.json({
          result: logsResult
        });
      }, function(err) {
        res.status(500)
          .json({
            message: err.message || err 
          });
      });
  }
};
