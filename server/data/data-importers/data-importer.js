'use strict';
let usersImporter = require('./users-importer');
let logger = require('./../../common/logger');

module.exports = {
  seedInitialData: function(shouldSeedData) {
    if (!shouldSeedData) {
      return;
    }

    usersImporter.importUsers()
      .then(function() {
        logger.log('Data imported!');
      })
      .catch(function(err) {
        logger.err(err);
      });
  }
};
