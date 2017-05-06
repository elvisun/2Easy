(function () {
  'use strict';

  angular
    .module('surveys')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Surveys',
      state: 'surveys',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'surveys', {
      title: 'List Surveys',
      state: 'surveys.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'surveys', {
      title: 'Create Survey',
      state: 'surveys.create',
      roles: ['user']
    });
  }
})();
