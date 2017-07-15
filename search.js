var db = new Dexie("clippingDB");
db.delete();
db.version(1).stores({
  items: 'url',
  facets: '[group+value],group'
});
db.open();

var app = angular.module('schemaorg', ['angular.filter', 'schemaorg-constants'], function($provide) {
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

app.controller('SearchController', function($scope, schemaorg, CustomSearch) {
  var sc = this;
  sc.searchResults = [];
  sc.searchFacets = [];

  $scope.doSearch = function(pages) {
    var userInput = $scope.keyword;
    if (userInput == null) {
      return;
    }
    var input = processUserInput(userInput, schemaorg);
    var searchPromises = [];
    for (i = 1; i <= pages; i++) {
      var promise = CustomSearch.exec(input.keyword, i);
      searchPromises.push(promise);
    }
    Promise.all(searchPromises.map(settle)).then(results => {
      db.items.clear();
      db.facets.clear();
      results.filter(x => x.status === "resolved").forEach(results => {
        storeResults(results, input.topics, schemaorg)
      });
      db.items.toArray(data => {
        sc.searchResults = data;
        $scope.$apply();
      });
      db.facets.toArray(data => {
        sc.searchFacets = data
        $scope.$apply();
      });
    });
  }
});

function processUserInput(input, schemaorg) {
  var keyword_split = input.split('#');
  var keyword = keyword_split[0];
  var topics = keyword_split.filter(str => { return str != keyword });
  if (topics.length == 0) {
    topics = Object.keys(schemaorg);
  }
  return {
    keyword: keyword,
    topics: topics
  }
}

// Solution for handling request failure gracefully in Promise.all
// Source: https://stackoverflow.com/questions/31424561/wait-until-all-es6-promises-complete-even-rejected-promises
function settle(promise) {
  return promise.then(function(v){ return {value:v, status: "resolved" }},
                      function(e){ return {value:e, status: "rejected" }});
}

function storeResults(results, topics, schemaorg) {
  var resultItems = results.value;
  resultItems.forEach(finding => {
    storeBasicData(finding);
    for (var i = 0; i < topics.length; i++) {
      var topic = topics[i];
      storeAnySchemaOrgData(finding, topic, schemaorg);
    }
  });
}

function storeBasicData(obj) {
  db.items.add({
    title: obj.title,
    url: obj.link,
    description: obj.snippet,
    schemaorg: []
  }).catch(err => {
    // console.error(err);
  });
}

function storeAnySchemaOrgData(obj, topic, schemaorg) {
  var data = getSchemaOrgData(obj, topic);
  if (data != null) {
    updateTableWithSchemaOrgData(obj, data);
    storeFacetsFromSchemaOrgData(data[topic], schemaorg[topic]);
  }
}

function updateTableWithSchemaOrgData(obj, data) {
  db.items.where('url').equals(obj.link).modify(item => {
    item.schemaorg.push(data)
  }).catch(err => {
    // console.error(err);
  });
}

function storeFacetsFromSchemaOrgData(schemaOrgData, selectedAttributes) {
  for (var i = 0; i < selectedAttributes.length; i++) {
    var attr = selectedAttributes[i];
    db.facets.add({
      group: attr,
      value: schemaOrgData[attr]
    }).catch(err => {
      // console.error(err);
    });
  }
}

function getSchemaOrgData(obj, topic) {
  if (!obj.hasOwnProperty('pagemap')) {
    return;
  }
  var pagemap = obj.pagemap;
  if (!pagemap.hasOwnProperty(topic)) {
    return;
  }
  var topicArray = pagemap[topic];
  var topicAttributes = findBestData(topicArray);
  var topicObject = {};
  topicObject[topic] = topicAttributes;
  return topicObject;
}

function findBestData(arr) {
  var toReturn = {};
  var bestInfoSize = -1;
  for (var i = 0; i < arr.length; i++) {
    var topicObject = arr[i];
    var infoSize = Object.keys(topicObject).length;
    if (infoSize > bestInfoSize) {
      toReturn = topicObject;
      bestInfoSize = infoSize;
    }
  }
  return toReturn;
}
