'use strict';
let mongoose = require('mongoose');
let constants = require('./../../common/constants');

module.exports = function() {
  let schema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    ratings: {
      type: [{
        author: {
          type: String,
          required: true
        },
        value: {
          type: Number,
          required: true
        }
      }],
      default: []
    },
    comments: {
      type: [{
        author: {
          type: String,
          required: true
        },
        content: {
          type: String,
          required: true
        },
        commentedOn: {
          type: Date,
          required: true,
          default: new Date()
        }
      }],
      default: []
    }
  });

  mongoose.model('TouristSite', schema);
};
