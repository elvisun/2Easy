'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Survey = mongoose.model('Survey'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Survey
 */
exports.create = function(req, res) {
  var survey = new Survey(req.body);
  survey.user = req.user;

  survey.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(survey);
    }
  });
};

/**
 * Show the current Survey
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var survey = req.survey ? req.survey.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  survey.isCurrentUserOwner = req.user && survey.user && survey.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(survey);
};

/**
 * Update a Survey
 */
exports.update = function(req, res) {
  var survey = req.survey ;

  survey = _.extend(survey , req.body);

  survey.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(survey);
    }
  });
};

/**
 * Delete an Survey
 */
exports.delete = function(req, res) {
  var survey = req.survey ;

  survey.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(survey);
    }
  });
};

/**
 * List of Surveys
 */
exports.list = function(req, res) { 
  Survey.find().sort('-created').populate('user', 'displayName').exec(function(err, surveys) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(surveys);
    }
  });
};

/**
 * Survey middleware
 */
exports.surveyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Survey is invalid'
    });
  }

  Survey.findById(id).populate('user', 'displayName').exec(function (err, survey) {
    if (err) {
      return next(err);
    } else if (!survey) {
      return res.status(404).send({
        message: 'No Survey with that identifier has been found'
      });
    }
    req.survey = survey;
    next();
  });
};
