'use strict';
let fs = require('fs');

module.exports = {
  registerRoutes: function(app) {
    let path = './server/config/routes',
      files = fs.readdirSync(path);

    files
      .filter(f => f != 'index.js')
      .forEach(f => {
        require(`./${f}`)(app);
      });
  }
};
