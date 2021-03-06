'use strict';
let encryption = require('./../../common/encryption');
let constants = require('./../../common/constants');
let logger = require('./../../common/logger');

module.exports = {
  importUsers: function() {
    let promise = new Promise(function(resolve, reject) {
      let User = require('mongoose').model('User');

      User.find()
        .then(function(data) {
          if (data.length <= 0) {
            logger.log('Adding Users to database.');
            let adminUser = {};

            adminUser.userName = 'admin';
            adminUser.password = encryption.hashText(encryption.hashText('admin'));
            adminUser.roles = [constants.ADMIN_ROLE, constants.USER_ROLE];
            adminUser.firstName = 'Admin';
            adminUser.lastName = 'Admin';

            let regularUser = {};
            regularUser.userName = 'regular';
            regularUser.password = encryption.hashText(encryption.hashText('regular'));
            regularUser.roles = [constants.USER_ROLE];
            regularUser.firstName = 'Regular';
            regularUser.lastName = 'User';

            let moderatorUser = {};
            moderatorUser.userName = 'moderator';
            moderatorUser.password = encryption.hashText(encryption.hashText('moderator'));
            moderatorUser.roles = [constants.MODERATOR_ROLE, constants.USER_ROLE];
            moderatorUser.firstName = 'Moderator';
            moderatorUser.lastName = 'User';

            let usersToCreate = [adminUser, moderatorUser, regularUser];

            User.create(usersToCreate, function(err, data) {
              if (err) {
                logger.err(err);
                reject(err);
                return;
              }

              logger.log('Users added to database!');
              resolve(data);
            });
          } else {
            resolve();
          }
        })
        .catch(function(err) {
          logger.err(err);
        });
    });

    return promise;
  }
};
