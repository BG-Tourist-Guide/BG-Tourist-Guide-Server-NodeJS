'use strict';
let modelValidator = require('./../common/model-validator');
let comments = require('./../services/comments-service.js').defaultInstance;

module.exports = {
  getCommentsForTouristSite: function(req, res) {
    let page = +req.query.page || 1;
    let touristSiteId = req.params.id;
    page -= 1;

    comments.getCommentsForTouristSite(touristSiteId, page)
      .then(function(data) {
        res.json({
          result: data
        });
      }, function(err) {
        res.status(400)
          .json(err);
      });
  },
  createComment: function(req, res) {
    let content = req.body.content;
    let touristSiteId = req.body.touristSiteId;
    let authorsUserName = req.user.userName;

    let comment = {
      author: authorsUserName,
      content: content,
      commentedOn: Date.now()
    };

    comments.createComment(touristSiteId, comment)
      .then(function(dbTouristSite) {
        res.status(201)
          .json({
            result: dbTouristSite
          });
      }, function(err) {
        console.log(err);
        res.status(400)
          .json({
            message: 'The comment was not saved.'
          });
      });
  }
};
