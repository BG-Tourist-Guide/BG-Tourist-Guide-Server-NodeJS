'use strict';
let constants = require('./constants');

module.exports = {
  isUserRequestModelValid: function(model) {
    if (!model.userName || !model.password) {
      return false;
    }

    if (model.userName.length < constants.MIN_USERNAME_LENGTH ||
      model.userName.length > constants.MAX_USERNAME_LENGTH) {
      return false;
    }

    if (model.password.length < constants.MIN_PASSWORD_LENGTH) {
      return false;
    }

    return true;
  },
  isTouristSiteRequestModelValid: function(model) {
    if (!model.title ||
      !model.description ||
      !model.latitude ||
      !model.longitude) {
        return false;
    }

    return true;
  }
};
