'use strict';
let mongoose = require('mongoose');
let modelsLoader = require('./../data/models');
let dataImporter = require('./../data/data-importers/data-importer');
let env = process.env.NODE_ENV || 'development';

module.exports = {
  configure: function() {
    let connectionString = 'mongodb://localhost:27017/BGTouristGuide';
    let shouldSeedData = true;

    if (env === 'development') {
      connectionString = 'mongodb://localhost:27017/BGTouristGuide';
    } else {
      connectionString = process.env.PRODUCTION_DB_CONNECTION_STRING;
      shouldSeedData = true;
    }

    modelsLoader.loadModels();
    mongoose.connect(connectionString);

    let database = mongoose.connection;

    database.once('open', function() {
      console.log('Database is running!');
      dataImporter.seedInitialData(shouldSeedData);
    });
  }
};
