var db = new Dexie("clippingDB");
db.delete();
db.version(1).stores({
  items: '[title+url]'
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
      db.items.clear();
      results.filter(x => x.status === "resolved").forEach(storeResults);
      db.items.toArray(data => {
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

function storeResults(results, index, array) {
  var resultItems = results.value;
  resultItems.forEach(finding => {
    storeBasicData(finding);
    addAnySchemaOrgData(finding, 'recipe');
  });
}

function storeBasicData(obj) {
  db.items.add({
    title: obj.title,
    url: obj.link,
    description: obj.snippet
  }).catch(err => {
    // console.error(err);
  });
}

function addAnySchemaOrgData(item, topic) {
  if (item.hasOwnProperty('pagemap')) {
    var pagemap = item.pagemap;
    if (pagemap.hasOwnProperty(topic)) {
      var data = pagemap[topic];
      var bestData = findBestData(data);
      db.items.put({
        title: item.title,
        url: item.link,
        description: data.description,
        schemaorg: bestData
      }).catch(err => {
        // console.error(err);
      });
    }
  }
}

function findBestData(data) {
  var bestData = {};
  var bestInfoSize = -1;
  for (var i = 0; i < data.length; i++) {
    var dataItem = data[i];
    var infoSize = Object.keys(dataItem).length;
    if (infoSize > bestInfoSize) {
      bestData = dataItem;
      bestInfoSize = infoSize;
    }
  }
  return bestData;
}
