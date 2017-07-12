var db = new Dexie("clippingDB");
db.delete();
db.version(1).stores({
  items: '[keyword+title+url],keyword'
});
db.open();

var app = angular.module('schemaorg', [], function($provide) {
  // Fixes'history.pushState is not available in packaged apps' error message
  // Source: https://github.com/angular/angular.js/issues/11932
  $provide.decorator('$window', function($delegate) {
    Object.defineProperty($delegate, 'history', {
      get: function() {
        return null;
      }
    });
    return $delegate;
  });
});

app.factory('CustomSearch', function($http) {
  var exec = function(keyword, page) {
    var offset = 10;
    var url = 'https://www.googleapis.com/customsearch/v1' +
      '?key=AIzaSyC0tYdp3uFxDdgJO4t5hZNznH7qsBFHFRw' +
      '&cx=000084546530648272235:2a0v4vyk8nu' +
      '&q=' + keyword +
      '&start=' + (((page - 1) * offset) + 1) +
      '&num=10';
    return $http.get(url).then(
      function(response) {
        return response.data.items;
      },
      function(err) {
        // TODO: Handle error
      });
  };
  return {
    exec: exec
  };
});

app.controller('SearchController', function($scope, CustomSearch) {
  $scope.doSearch = function() {
    $scope.result = []
    repeat = 2
    for (i = 1; i <= repeat; i++) {
      CustomSearch.exec($scope.keyword, i).then(
        function(result) {
          result.forEach(function(element, index, array) {
            db.items.add({
              keyword: $scope.keyword,
              title: element.title,
              description: element.snippet,
              url: element.link
            }).
            catch((err) => {
              // NO-OP: Ignore error flags
            });
          });
          db.items.where('keyword').equalsIgnoreCase($scope.keyword).toArray(result => {
            // console.log(result);
            $scope.result = $scope.result.concat(result);
            $scope.result_size = result.length;
          });
        });
    }
  }
});
