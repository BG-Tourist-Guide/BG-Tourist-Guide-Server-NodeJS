'use strict';
let passport = require('passport');
let BearerStrategy = require('passport-http-bearer');

module.exports = {
  configure: function() {
    let User = require('mongoose').model('User');

    passport.use(new BearerStrategy(
      function(token, done) {
        User.findOne({
          token: token
        }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false);
          }

          return done(null, user, {
            scope: 'all'
          });
        });
      }
    ));
  }
};
