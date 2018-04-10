'use strict';

angular.module('search', []);
angular.module('settings', []);

angular.module('schemaorg', [
  'ui.materialize',
  'angular.filter',
  'videosharing-embed',
  'rzModule',
  'elif',
  'search',
  'settings'],
  function($provide) {
    // Fixes'history.pushState is not available in packaged apps' error message
    // Source: https://github.com/angular/angular.js/issues/11932
    $provide.decorator('$window', function($delegate) {
      Object.defineProperty($delegate, 'history', {
        get: function() {
          return null;
        }
      });
      return $delegate;
    })
});
