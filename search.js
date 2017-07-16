var db = new Dexie("clippingDB");
db.delete();
db.version(1).stores({
  items: 'url'
});
db.open();

var app = angular.module('schemaorg', ['angular.filter', 'search-facets', 'data-units'], function($provide) {
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

app.filter('removeSeparator', function() {
  return function(input){
    var text = input.replace(/\s-\s/g, '|');
    var RegExp = /^([^|•:(+]+)/;
    var match = RegExp.exec(text);
    return match[1];
  };
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

app.controller('SearchController', function($scope, facets, units, CustomSearch) {
  var sc = this;
  sc.searchResults = [];
  sc.searchFacets = [];

  $scope.doSearch = function(pages) {
    var userInput = $scope.keyword;
    if (userInput == null) {
      return;
    }
    var input = processUserInput(userInput, facets);
    var searchPromises = [];
    for (i = 1; i <= pages; i++) {
      var promise = CustomSearch.exec(input.keyword, i);
      searchPromises.push(promise);
    }
    Promise.all(searchPromises.map(settle)).then(results => {
      db.items.clear();
      results.filter(x => x.status === "resolved").forEach(output => {
        var topics = input.topics;
        var searchResults = output.value;
        storeResults(searchResults, topics, facets, units)
      });
      db.items.toArray(data => {
        sc.searchResults = data;
        var facetData = [];
        for (var i = 0; i < data.length; i++) {
          facetData = facetData.concat(data[i].properties);
        }
        sc.searchFacets = facetData;
        $scope.$apply();
      });
    });
  }
});

function processUserInput(input, facets) {
  var keyword_split = input.split('#');
  var keyword = keyword_split[0];
  var topics = keyword_split.filter(str => { return str != keyword });
  if (topics.length == 0) {
    topics = Object.keys(facets);
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

function storeResults(searchResults, topics, facets, units) {
  if (searchResults != null) {
    searchResults.forEach(resultItem => {
      var pkItem = resultItem.link;
      storeBasicData(pkItem, resultItem);
      storeSchemaOrgData(pkItem, resultItem, topics, facets, units);
    });
  }
}

function storeBasicData(pkItem, resultItem) {
  db.items.add({
    url: pkItem,
    title: resultItem.title,
    description: resultItem.snippet,
    properties: [],
    schemaorg: [],
  }).catch(err => {
    // console.error(err);
  });
}

function storeSchemaOrgData(pkItem, resultItem, topics, facets, units) {
  for (var i = 0; i < topics.length; i++) {
    var topic = topics[i];
    var schemaOrgData = getSchemaOrgData(resultItem, topic);
    if (schemaOrgData != null) {
      updateTableWithSchemaOrgData(pkItem, schemaOrgData);
      updateTableWithExtraProperties(pkItem, schemaOrgData, topic, facets, units);
    }
  }
}

function updateTableWithSchemaOrgData(pkItem, schemaOrgData) {
  db.items.where('url').equals(pkItem).modify(item => {
    item.schemaorg.push(schemaOrgData)
  }).catch(err => {
    // console.error(err);
  });
}

function updateTableWithExtraProperties(pkItem, schemaOrgData, topic, facets, units) {
  db.items.where('url').equals(pkItem).modify(item => {
    var topicFacet = facets[topic];
    for (var i = 0; i < topicFacet.terms.length; i++) {
      var term = topicFacet.terms[i];
      var label = topicFacet.labels[i];
      var value = toNumeric(schemaOrgData[topic][term], units[term]);
      if (value != null) {
        var property = {
          domain: topic,
          name: term,
          label: label,
          value: value,
          unit: units[term]
        }
        item.properties.push(property);
      }
    }
  }).catch(err => {
    // console.error(err);
  });
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

function toNumeric(value, unit) {
  return value;
}
