'use strict';
let hat = require('hat');

module.exports = {
  generateToken: function() {
    let token = hat();

    return token;
  }
};
