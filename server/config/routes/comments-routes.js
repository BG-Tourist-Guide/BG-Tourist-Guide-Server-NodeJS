'use strict';
let express = require('express');
let commentsController = require('./../../controllers/comments-controller');
let identity = require('./../../common/identity');

module.exports = function(app) {
  let router = express.Router();

  router
    .post('/', identity.requiresAuthentication(), commentsController.createComment)
    .get('/:id', identity.requiresAuthentication(), commentsController.getCommentsForTouristSite);

  app.use('/api/comments', router);
};
