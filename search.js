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

app.factory('CustomSearch', function($q, $http) {
  var exec = function(keyword, page) {
    var defer = $q.defer();
    var offset = 10;
    var url = 'https://www.googleapis.com/customsearch/v1' +
      '?key=AIzaSyC0tYdp3uFxDdgJO4t5hZNznH7qsBFHFRw' +
      '&cx=000084546530648272235:2a0v4vyk8nu' +
      '&q=' + keyword +
      '&start=' + (((page - 1) * offset) + 1) +
      '&num=10';
    $http.get(url).then(
      function(response) {
        defer.resolve(response.data.items);
      },
      function(err) {
        defer.reject(err);
      });
    return defer.promise;
  };
  return {
    exec: exec
  };
});

app.controller('SearchController', function($scope, CustomSearch) {
  var sc = this;
  sc.searchResults = [];

  $scope.doSearch = function(pages) {
    var searchPromises = [];
    for (i = 1; i <= pages; i++) {
      var promise = CustomSearch.exec($scope.keyword, i);
      searchPromises.push(promise);
    }
    Promise.all(searchPromises.map(settle)).then(results => {
      var resolvedResults = results.filter(x => x.status === "resolved");
      resolvedResults.forEach(function(resultObject, index, array) {
        var resultItems = resultObject.value;
        resultItems.forEach(function(item, index, array) {
          db.items.add({
            keyword: $scope.keyword,
            title: item.title,
            description: item.snippet,
            url: item.link
          }).catch(err => {
            // console.error(err);
          });
        });
      });
      db.items.where('keyword').equalsIgnoreCase($scope.keyword).toArray(data => {
        sc.searchResults = data;
        $scope.$apply();
      });
    });
  }
});

// Solution for handling request failure gracefully in Promise.all
// Source: https://stackoverflow.com/questions/31424561/wait-until-all-es6-promises-complete-even-rejected-promises
function settle(promise) {
  return promise.then(function(v){ return {value:v, status: "resolved" }},
                      function(e){ return {value:e, status: "rejected" }});
}
