'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let corsService = require('./../infrastructure/cors-service');

module.exports = {
  configure: function(app) {
    app.use(bodyParser.json());
    app.use(corsService);
  }
};
