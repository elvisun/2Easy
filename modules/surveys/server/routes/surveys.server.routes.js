'use strict';

/**
 * Module dependencies
 */
var surveysPolicy = require('../policies/surveys.server.policy'),
  surveys = require('../controllers/surveys.server.controller');

module.exports = function(app) {
  // Surveys Routes
  app.route('/api/surveys').all(surveysPolicy.isAllowed)
    .get(surveys.list)
    .post(surveys.create);

  app.route('/api/surveys/:surveyId').all(surveysPolicy.isAllowed)
    .get(surveys.read)
    .put(surveys.update)
    .delete(surveys.delete);

  // Finish by binding the Survey middleware
  app.param('surveyId', surveys.surveyByID);
};
