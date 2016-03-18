'use strict';
let express = require('express');
let usersController = require('./../../controllers/users-controller');
let identity = require('./../../common/identity');

module.exports = function(app) {
  let router = express.Router();

  router
    .post('/', usersController.createUser)
    .get('/profile', usersController.getProfileInformation)
    .put('/token', usersController.loginUser);

  app.use('/api/users', router);
};
