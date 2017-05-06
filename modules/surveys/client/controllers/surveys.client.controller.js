(function () {
  'use strict';

  // Surveys controller
  angular
    .module('surveys')
    .controller('SurveysController', SurveysController);

  SurveysController.$inject = ['$scope', '$state', 'Authentication', 'surveyResolve'];

  function SurveysController ($scope, $state, Authentication, survey) {
    var vm = this;

    vm.authentication = Authentication;
    vm.survey = survey;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Survey
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.survey.$remove($state.go('surveys.list'));
      }
    }

    // Save Survey
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.surveyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.survey._id) {
        vm.survey.$update(successCallback, errorCallback);
      } else {
        vm.survey.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('surveys.view', {
          surveyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
