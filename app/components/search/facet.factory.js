'use strict';

angular.module('search')

.factory('CategoryFacetService', function() {
  var categoryFacets = [];

  function createNew(property) {
    var categoryFacet = {
      id: property.id,
      name: property.name,
      label: property.label,
      topic: property.domain.name,
      type: "categorial",
      visible: false,
      choices: []
    };
    return categoryFacet;
  }

  function addChoice(facet, value) {
    var choice = {
      value: value,
      selected: false
    };
    facet.choices.push(choice);
  }

  var add = function($scope, property) {
    var facet = get(property.id);
    if (facet == null) {
      facet = createNew(property);
      categoryFacets.push(facet);
    }
    var choiceIndex = findIndex(facet.choices, "value", property.value);
    if (choiceIndex === -1) {
      addChoice(facet, property.value);
    }
  }

  var get = function(id) {
    var index = findIndex(categoryFacets, "id", id);
    return categoryFacets[index];
  }

  var reset = function(id) {
    var facet = get(id);
    for (var i = 0; i < facet.choices.length; i++) {
      facet.choices[i].selected = false;
    }
  }

  var clear = function() {
      categoryFacets.splice(0, categoryFacets.length);
  }

  return {
    categoryFacets: categoryFacets,
    add: add,
    get: get,
    reset: reset,
    clear: clear
  }
})

.factory('RangeFacetService', function() {
  var rangeFacets = [];

  function createNew($scope, property) {
    var rangeFacet = {
      id: property.id,
      name: property.name,
      label: property.label,
      topic: property.domain.name,
      type: "ranged",
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

  var add = function($scope, property) {
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

function findIndex(array, key, value) {
  for(var i = 0; i < array.length; i++) {
    if (array[i][key] === value) return i;
  }
  return -1;
}
