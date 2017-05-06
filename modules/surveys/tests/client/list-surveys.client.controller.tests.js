(function () {
  'use strict';

  describe('Surveys List Controller Tests', function () {
    // Initialize global variables
    var SurveysListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SurveysService,
      mockSurvey;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SurveysService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SurveysService = _SurveysService_;

      // create mock article
      mockSurvey = new SurveysService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Survey Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Surveys List controller.
      SurveysListController = $controller('SurveysListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockSurveyList;

      beforeEach(function () {
        mockSurveyList = [mockSurvey, mockSurvey];
      });

      it('should send a GET request and return all Surveys', inject(function (SurveysService) {
        // Set POST response
        $httpBackend.expectGET('api/surveys').respond(mockSurveyList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.surveys.length).toEqual(2);
        expect($scope.vm.surveys[0]).toEqual(mockSurvey);
        expect($scope.vm.surveys[1]).toEqual(mockSurvey);

      }));
    });
  });
})();
