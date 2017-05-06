(function () {
  'use strict';

  angular
    .module('surveys')
    .controller('SurveysListController', SurveysListController);

  SurveysListController.$inject = ['SurveysService'];

  function SurveysListController(SurveysService) {
    var vm = this;

    vm.surveys = SurveysService.query();
  }
})();
