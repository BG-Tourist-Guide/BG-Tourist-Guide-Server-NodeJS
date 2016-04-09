'use strict';

let path = require('path');
let nodeFileLog = require('node-filelog');
let constants = require('./constants');
let fileLogger = new nodeFileLog(constants.MESSAGES_LOGS_FOLDER, constants.ERRORS_LOGS_FOLDER);
fileLogger.useShortLog();
let env = process.env.NODE_ENV || constants.DEVELOPMENT_ENVIRONMENT;

function prepareMessageForLog(message) {
  return `[${new Date()}] -> [${message}]`;
}

module.exports = {
  log: function(message) {
    message = prepareMessageForLog(message);

    if (env === constants.DEVELOPMENT_ENVIRONMENT) {
      console.log(message);
    } else {
      fileLogger.msg(message);
    }
  },
  err: function(message) {
    message = prepareMessageForLog(message);

    if (env === constants.DEVELOPMENT_ENVIRONMENT) {
      console.error(message);
    } else {
      fileLogger.err(message);
    }
  }
};