(function () {
  'use strict';

  describe('Surveys Route Tests', function () {
    // Initialize global variables
    var $scope,
      SurveysService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SurveysService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SurveysService = _SurveysService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('surveys');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/surveys');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SurveysController,
          mockSurvey;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('surveys.view');
          $templateCache.put('modules/surveys/client/views/view-survey.client.view.html', '');

          // create mock Survey
          mockSurvey = new SurveysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Survey Name'
          });

          //Initialize Controller
          SurveysController = $controller('SurveysController as vm', {
            $scope: $scope,
            surveyResolve: mockSurvey
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:surveyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.surveyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            surveyId: 1
          })).toEqual('/surveys/1');
        }));

        it('should attach an Survey to the controller scope', function () {
          expect($scope.vm.survey._id).toBe(mockSurvey._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/surveys/client/views/view-survey.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SurveysController,
          mockSurvey;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('surveys.create');
          $templateCache.put('modules/surveys/client/views/form-survey.client.view.html', '');

          // create mock Survey
          mockSurvey = new SurveysService();

          //Initialize Controller
          SurveysController = $controller('SurveysController as vm', {
            $scope: $scope,
            surveyResolve: mockSurvey
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.surveyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/surveys/create');
        }));

        it('should attach an Survey to the controller scope', function () {
          expect($scope.vm.survey._id).toBe(mockSurvey._id);
          expect($scope.vm.survey._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/surveys/client/views/form-survey.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SurveysController,
          mockSurvey;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('surveys.edit');
          $templateCache.put('modules/surveys/client/views/form-survey.client.view.html', '');

          // create mock Survey
          mockSurvey = new SurveysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Survey Name'
          });

          //Initialize Controller
          SurveysController = $controller('SurveysController as vm', {
            $scope: $scope,
            surveyResolve: mockSurvey
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:surveyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.surveyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            surveyId: 1
          })).toEqual('/surveys/1/edit');
        }));

        it('should attach an Survey to the controller scope', function () {
          expect($scope.vm.survey._id).toBe(mockSurvey._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/surveys/client/views/form-survey.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
