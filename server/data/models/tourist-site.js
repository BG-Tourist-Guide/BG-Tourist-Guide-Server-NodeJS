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
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  });

  mongoose.model('TouristSite', schema);
};
