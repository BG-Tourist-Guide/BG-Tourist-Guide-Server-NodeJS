'use strict';
let express = require('express');

module.exports = function(app) {
  let router = express.Router();

  router
    .get('/', function(req, res) {
      res.render('index.html');
    });

  app.use('/', router);
};
