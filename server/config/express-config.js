'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let ejs = require('ejs');
let path = require('path');
let corsService = require('./../infrastructure/cors-service');

module.exports = {
  configure: function(app) {
    let webPath = path.join(__dirname, '..', '..', 'public', 'web');
    let viewsPath = path.join(webPath, 'app', 'views');

    app.use(bodyParser.json());
    app.use(corsService);
    app.engine('html', ejs.renderFile);
    app.set('views', viewsPath);
    app.use(express.static(webPath));
  }
};
