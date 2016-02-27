'use strict';
let usersImporter = require('./users-importer');

module.exports = {
  seedInitialData: function(shouldSeedData) {
    if (!shouldSeedData) {
      return;
    }

    usersImporter.importUsers()
      .then(function() {
        console.log('Data imported!');
      })
      .catch(function(err) {
        console.log(err);
      });
  }
};
