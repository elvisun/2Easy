//Surveys service used to communicate Surveys REST endpoints
(function () {
  'use strict';

  angular
    .module('surveys')
    .factory('SurveysService', SurveysService);

  SurveysService.$inject = ['$resource'];

  function SurveysService($resource) {
    return $resource('api/surveys/:surveyId', {
      surveyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
