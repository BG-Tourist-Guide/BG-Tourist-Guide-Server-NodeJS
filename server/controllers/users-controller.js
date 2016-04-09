'use strict';
let User = require('mongoose').model('User');
let encryption = require('./../common/encryption');
let identity = require('./../common/identity');
let constants = require('./../common/constants');
let logger = require('./../common/logger');

module.exports = {
  createUser: function(req, res) {
    let modelValidator = require('./../common/model-validator');
    let user = req.body;

    if (!modelValidator.isUserRequestModelValid(user)) {
      res.status(400)
        .json({
          message: 'Invalid user registration data!'
        });

      return;
    }

    identity.createUser(user)
      .then(function(dbUser) {
        dbUser.password = undefined;

        res.status(201)
          .json({
            result: dbUser
          });
      })
      .catch(function(err) {
        res.status(400)
          .json(err);
      });
  },
  loginUser: function(req, res, next) {
    let userName = req.body.userName;
    let password = req.body.password;

    identity.authenticateUser(userName, password)
      .then(function(user) {
        user.password = undefined;
        res.json({
          result: user
        });
      })
      .catch(function(err) {
        logger.err(err);
        res.status(400)
          .json(err);
      });
  },
  getProfileInformation(req, res) {
    let user = req.user;

    identity.getProfileInformation(user)
      .then(function(dbUser) {
        dbUser.password = undefined;
        res.json({
          result: dbUser
        });
      }, function(err) {
        res.status(400)
          .json(err);
      });
  }
};
