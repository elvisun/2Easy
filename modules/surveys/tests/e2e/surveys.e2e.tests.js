'use strict';

describe('Surveys E2E Tests:', function () {
  describe('Test Surveys page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/surveys');
      expect(element.all(by.repeater('survey in surveys')).count()).toEqual(0);
    });
  });
});
