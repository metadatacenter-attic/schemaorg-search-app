var propertyCategories = [];
var db = new Dexie("clippingDB");
db.delete();
db.version(1).stores({
  items: 'url'
});
db.open();

var app = angular.module('schemaorg', ['angular.filter', 'rzModule', 'user-profiles', 'search-facets', 'data-units'], function($provide) {
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
  var exec = function(apiKey, searchEngineId, keyword, page) {
    var defer = $q.defer();
    var offset = 10;
    var url = 'https://www.googleapis.com/customsearch/v1' +
      '?key=' + apiKey +
      '&cx=' + searchEngineId +
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

app.controller('SearchController', function($scope, profiles, facets, units, CustomSearch) {
  var profile = profiles['schemaorg'];
  var sc = this;
  sc.searchResults = [];
  sc.categoricalFacet = [];
  sc.numericalRangeFacet = [];

  $scope.doSearch = function() {
    var propertyCategories = [];

    var userInput = $scope.keyword;
    if (userInput == null) {
      return;
    }
    var input = processUserInput(userInput, facets);
    var searchPromises = [];
    var pages = profile.pageLimit;
    var apiKey = profile.apiKey;
    var searchEngineId = profile.searchEngineId;
    var keyword = input.keyword;
    for (i = 1; i <= pages; i++) {
      var promise = CustomSearch.exec(apiKey, searchEngineId, keyword, i);
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

        var categoricalFacet = [];
        var numericalRangeFacet = [];
        for (var i = 0; i < data.length; i++) {
          var itemProperties = data[i].properties;
          for (var j = 0; j < itemProperties.length; j++) {
            var propertyItem = itemProperties[j];
            if (propertyItem.range === "text") {
              var facet = {
                category: propertyItem.category,
                domain: propertyItem.domain,
                name: propertyItem.name,
                label: propertyItem.label + " " + getUnitLabel(propertyItem.unit),
                value: propertyItem.value,
                selected: false,
                visible: true
              }
              var found = categoricalFacet.some(function(facet) {
                return facet.domain === propertyItem.domain &&
                    facet.name === propertyItem.name &&
                    facet.value === propertyItem.value;
              });
              if (!found) {
                categoricalFacet.push(facet);
              }
            } else if (propertyItem.range === "numeric" || propertyItem.range === "duration") {
              numericalRangeFacet[propertyItem.category] = numericalRangeFacet[propertyItem.category] || {
                  category: propertyItem.category,
                  domain: propertyItem.domain,
                  name: propertyItem.name,
                  label: propertyItem.label + " " + getUnitLabel(propertyItem.unit),
                  minValue: Number.MAX_SAFE_INTEGER,
                  maxValue: Number.MIN_SAFE_INTEGER,
                  options: {
                    id: propertyItem.category,
                    floor: 0,
                    ceil: Number.MIN_SAFE_INTEGER,
                    step: 1,
                    hideLimitLabels: true,
                    onChange: $scope.onSliderChanged
                  },
                  visible: true
                };
              var value = propertyItem.value;
              if (value < numericalRangeFacet[propertyItem.category].minValue) {
                numericalRangeFacet[propertyItem.category].minValue = value;
              }
              if (value > numericalRangeFacet[propertyItem.category].maxValue) {
                numericalRangeFacet[propertyItem.category].maxValue = value;
                numericalRangeFacet[propertyItem.category].options.ceil = value;
              }
            }
          }
        }
        sc.categoricalFacet = categoricalFacet;
        sc.numericalRangeFacet = numericalRangeFacet.filter(() => { return true; });
        $scope.$apply();
      });
    });
  }

  sc.filterModel = [];

  $scope.onClose = function(facet) {
    facet.visible = false;
  }

  $scope.onCheckboxChanged = function(facet) {
    var filterPosition = findIndex(sc.filterModel, "id", facet.category);
    if (filterPosition == -1) {
      sc.filterModel.push({
        id: facet.category,
        domain: facet.domain,
        name: facet.name,
        values: [],
        type: "categorical",
        visible: facet.visible
      });
      filterPosition = sc.filterModel.length - 1;
    }
    if (facet.selected) {
      sc.filterModel[filterPosition].values.push(facet.value);
    } else {
      var valuePosition = sc.filterModel[filterPosition].values.indexOf(facet.value);
      if (valuePosition != -1) {
        sc.filterModel[filterPosition].values.splice(valuePosition, 1);
      }
    }
  }

  $scope.onSliderChanged = function(id) {
    var resultArr = sc.numericalRangeFacet.filter(obj => { return obj.category == id });
    var facet = resultArr[0];
    var filterPosition = findIndex(sc.filterModel, "id", facet.category);
    if (filterPosition == -1) {
      sc.filterModel.push({
        id: facet.category,
        domain: facet.domain,
        name: facet.name,
        values: [],
        type: "range",
        visible: facet.visible
      });
      filterPosition = sc.filterModel.length - 1;
    }
    sc.filterModel[filterPosition].values[0] = facet.minValue;
    sc.filterModel[filterPosition].values[1] = facet.maxValue;
  }

  $scope.$watch('sc.filterModel', function(filterModel) {
    db.items.toArray(data => {
      var filterSize = filterModel.length;
      if (filterSize > 0) {
        data = data.filter(item => {
          var evalOnEachFilter = [];
          for (var i = 0; i < filterSize; i++) {
            var filter = filterModel[i];
            evalOnEachFilter[i] = (item.types.length == 0) || item.types.includes(filter.domain);
            for (var j = 0; j < item.properties.length; j++) {
              var property = item.properties[j];
              if (property.domain == filter.domain && property.name == filter.name) {
                if (filter.type === "categorical") {
                  evalOnEachFilter[i] = evalOnEachFilter[i] &&
                      filter.values.includes(property.value);
                } else if (filter.type === "range") {
                  evalOnEachFilter[i] = evalOnEachFilter[i] &&
                      property.value >= filter.values[0] &&
                      property.value <= filter.values[1];
                }
              }
            }
          }
          return evalOnEachFilter.reduce((a, b) => { return a && b; });
        });
      }
      sc.searchResults = data;
      $scope.$apply();
    });
  }, true);
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
    types: [],
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
      updateTableWithSchemaOrgTypes(pkItem, schemaOrgData);
      updateTableWithSchemaOrgProperties(pkItem, schemaOrgData, topic, facets, units);
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

function updateTableWithSchemaOrgTypes(pkItem, schemaOrgData) {
  db.items.where('url').equals(pkItem).modify(item => {
    var types = Object.keys(schemaOrgData);
    for (var i = 0; i < types.length; i++) {
      item.types.push(types[i]);
    }
  }).catch(err => {
    // console.error(err);
  });
}

function updateTableWithSchemaOrgProperties(pkItem, schemaOrgData, topic, facets, units) {
  db.items.where('url').equals(pkItem).modify(item => {
    var topicFacet = facets[topic];
    for (var i = 0; i < topicFacet.terms.length; i++) {
      var term = topicFacet.terms[i];
      var label = topicFacet.labels[i];
      var dtype = topicFacet.dtype[i];
      var value = schemaOrgData[topic][term];
      var propertyCategoryName = topic+term;
      var propertyCategory = propertyCategories.indexOf(propertyCategoryName);
      if (propertyCategory === -1) {
        propertyCategories.push(propertyCategoryName);
        propertyCategory = propertyCategories.length - 1;
      }
      if (value != null) {
        var property = {
          category: propertyCategory,
          domain: topic,
          range: dtype,
          name: term,
          label: label,
          value: refineValue(value, dtype, units[term]),
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

function refineValue(value, dtype, unit) {
  if (dtype === "numeric") {
    return refineNumericData(value, unit);
  } else if (dtype === "duration") {
    return refineDurationData(value, unit);
  }
  return value;
}

function refineNumericData(value, unit) {
  if (unit != null) {
    try {
      return Qty(value).to(unit).scalar;
    } catch (err) {
      return autoFixNumericData(value);
    }
  } else {
    return autoFixNumericData(value);
  }
}

function refineDurationData(value, unit) {
  var duration = moment.duration(value);
  if (duration._milliseconds != 0) {
    return duration.as(unit);
  } else {
    return autoFixDurationData(value);
  }
}

function autoFixNumericData(value) {
  var numericValue = getNumberOnly(value)
  console.log("INFO: Applying an auto-fix for [numeric] data by converting " +
      "\"" + value + "\" to \"" + numericValue + "\"");
  return numericValue;
}

function autoFixDurationData(value) {
  var durationValue = getNumberOnly(value);
  console.log("INFO: Applying an auto-fix for [duration] data by converting " +
      "\"" + value + "\" to \"" + durationValue + "\"");
  return durationValue;
}

function getNumberOnly(text) {
  var RegExp = /(\d+([\/\.]\d+)?)/;
  var match = RegExp.exec(text);
  return evalNumber(match[1]);
}

function evalNumber(number) {
  var value = number;
  var y = number.split(' ');
  if (y.length > 1) {
    var z = y[1].split('/');
    value = +y[0] + (z[0] / z[1]);
  } else {
    var z = y[0].split('/');
    if (z.length > 1) {
      value = z[0] / z[1];
    }
  }
  return +value;
}

function findIndex(arr, key, value) {
  for(var i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) return i;
  }
  return -1;
}

function getUnitLabel(unit) {
  if (unit == null) {
    return "";
  } else {
    return "(" + unit + ")"
  }
}
