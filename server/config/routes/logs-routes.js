'use strict';
let express = require('express');
let logsController = require('./../../controllers/logs-controller');
let identity = require('./../../common/identity');

module.exports = function(app) {
  let router = express.Router();

  router
    .get('/messages', identity.requiresAuthentication(), logsController.getMessages)
    .get('/errors', identity.requiresAuthentication(), logsController.getErrors);

  app.use('/api/logs', router);
};
