'use strict';

angular.module('search')

.factory('RangeFacetService', function() {
  var rangeFacets = [];

  function createNew($scope, property) {
    var rangeFacet = {
      id: property.id,
      label: property.label,
      topic: property.topic.id,
      type: "range",
      visible: false,
      unit: property.unit,
      minValue: Number.MAX_SAFE_INTEGER,
      maxValue: Number.MIN_SAFE_INTEGER,
      options: {
        id: property.id,
        floor: Number.MAX_SAFE_INTEGER,
        ceil: Number.MIN_SAFE_INTEGER,
        step: 1,
        hideLimitLabels: true,
        onChange: $scope.onSliderChanged
      }
    };
    return rangeFacet;
  }

  function findIndex(array, key, value) {
    for(var i = 0; i < array.length; i++) {
      if (array[i][key] === value) return i;
    }
    return -1;
  }

  var add = function($scope, property) {
    if (property.filterable) {
      var facet = get(property.id);
      if (facet == null) {
        facet = createNew($scope, property);
        rangeFacets.push(facet);
      }
      var value = property.value;
      if (value < facet.minValue) {
        facet.minValue = value;
        facet.options.floor = value;
      }
      if (value > facet.maxValue) {
        facet.maxValue = value;
        facet.options.ceil = value;
      }
    }
  }

  var get = function(id) {
    var index = findIndex(rangeFacets, "id", id);
    return rangeFacets[index];
  }

  var reset = function(id) {
    var facet = get(id);
    facet.minValue = facet.options.floor;
    facet.maxValue = facet.options.ceil;
  }

  var clear = function() {
      rangeFacets.splice(0, rangeFacets.length);
  }

  return {
    rangeFacets: rangeFacets,
    add: add,
    get: get,
    reset: reset,
    clear: clear
  }
});
