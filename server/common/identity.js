'use strict';
let passport = require('passport');
let tokenGenerator = require('./../common/token-generator');
let logger = require('./../common/logger');
let User = require('mongoose').model('User');
let constants = require('./constants');
let encryption = require('./encryption');

module.exports = {
  requiresAuthentication: function() {
    return passport.authenticate('bearer', {
      session: false
    });
  },
  authenticateUser: function(userName, password) {
    let encryptedPassword = encryption.hashText(password);

    let promise = new Promise(function(resolve, reject) {
      User.findOne({
        userName,
        password: encryptedPassword
      }, function(err, user) {
        if (err || !user) {
          reject({
            message: 'Invalid authentication data!'
          });
          return;
        }

        user.token = user.token || tokenGenerator.generateToken();
        user.save(function(err, dbUser) {
          if (err) {
            reject(err);
            return;
          }

          resolve(dbUser);
        });
      });
    });

    return promise;
  },
  createUser: function(user) {
    user.password = encryption.hashText(user.password);
    user.token = tokenGenerator.generateToken();
    user.visitedTouristSites = [];
    user.score = 0;

    let promise = new Promise(function(resolve, reject) {
      User.create(user, function(err, data) {
        if (err || !data) {
          err = err || {
            message: 'Cannot create user.'
          };

          logger.err(err);
          reject(err);
          return;
        }

        resolve(data);
      });
    });

    return promise;
  },
  isAuthorizedForRole: function(user, role) {
    return user.roles.indexOf(role) > -1;
  },
  getProfileInformation: function(user) {
    let promise = new Promise(function(resolve, reject) {
      User.findById(user._id)
        .then(function(dbUser) {
          resolve(dbUser);
        }, reject);
    });

    return promise;
  }
};
