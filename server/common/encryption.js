'use strict';
let sha1 = require('sha1');

module.exports = {
  hashText: function(text) {
    let hash = sha1(text);

    return hash;
  }
};
