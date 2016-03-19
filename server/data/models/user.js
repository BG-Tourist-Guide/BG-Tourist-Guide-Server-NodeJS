'use strict';
let mongoose = require('mongoose');
let constants = require('./../../common/constants');

module.exports = function() {
  let schema = new mongoose.Schema({
    userName: {
      type: String,
      required: true,
      unique: true,
      minLength: constants.MIN_USERNAME_LENGTH,
      maxLength: constants.MAX_USERNAME_LENGTH
    },
    password: {
      type: String,
      required: true
    },
    registrationDate: {
      type: Date,
      required: true,
      default: new Date()
    },
    roles: {
      type: [String],
      required: true,
      default: [constants.USER_ROLE]
    },
    token: {
      type: String
    },
    visitedTouristSites: {
      type: [{
        touristSiteId: {
          type: String,
          required: true
        },
        dateOfVisit: {
          type: Date,
          required: true,
          default: new Date()
        }
      }]
    },
    score: {
      type: Number,
      default: 0
    }
  });

  mongoose.model('User', schema);
};
