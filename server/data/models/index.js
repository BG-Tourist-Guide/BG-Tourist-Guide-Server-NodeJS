'use strict';
let fs = require('fs');

module.exports = {
  loadModels: function() {
    let path = './server/data/models',
      files = fs.readdirSync(path);

    files
      .filter(f => f != 'index.js')
      .forEach(f => {
        require(`./${f}`)();
      });
  }
};
