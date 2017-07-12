var db = new Dexie("clippingDB");
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

app.controller('SearchController', function($scope, $http) {
  $scope.doSearch = function() {
    $scope.result = []
    offset = 10;
    repeat = 2
    for (i = 1; i <= repeat; i++) {
      var url = 'https://www.googleapis.com/customsearch/v1' +
        '?key=AIzaSyC0tYdp3uFxDdgJO4t5hZNznH7qsBFHFRw' +
        '&cx=000084546530648272235:2a0v4vyk8nu' +
        '&q=' + $scope.keyword +
        '&start=' + (((i - 1) * offset) + 1) +
        '&num=10';
      $http.get(url).
      then(function(response) {
          var search_result = response.data.items;
          // console.log(search_result);
          search_result.forEach(function(element, index, array) {
            // console.log(element);
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
        },
        function(err) {
          // TODO: Handle error
        });
    }
  }
});
