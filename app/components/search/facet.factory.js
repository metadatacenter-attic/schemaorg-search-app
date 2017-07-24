'use strict';

angular.module('search')

.factory('CategorialFacetService', function() {
  var categorialFacets = [];

  function createNew(property) {
    var categorialFacet = {
      id: property.id,
      name: property.name,
      label: property.label,
      topic: property.domain.name,
      type: "categorial",
      visible: false,
      choices: []
    };
    return categorialFacet;
  }

  function addChoice(facet, value) {
    var choice = {
      value: value,
      selected: false
    };
    facet.choices.push(choice);
  }

  var add = function(property) {
    var facet = get(property.id);
    if (facet == null) {
      facet = createNew(property);
      categorialFacets.push(facet);
    }
    var choiceIndex = findIndex(facet.choices, "value", property.value);
    if (choiceIndex === -1) {
      addChoice(facet, property.value);
    }
  }

  var get = function(id) {
    var index = findIndex(categorialFacets, "id", id);
    return categorialFacets[index];
  }

  var clear = function() {
      categorialFacets.splice(0, categorialFacets.length);
  }

  return {
    categorialFacets: categorialFacets,
    add: add,
    get: get,
    clear: clear
  }
})

.factory('NumeralFacetService', function() {
  var numeralFacets = [];

  function createNew(property, onSliderChanged) {
    var numeralFacet = {
      id: property.id,
      name: property.name,
      label: property.label,
      topic: property.domain.name,
      type: "numeral",
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
        onChange: onSliderChanged
      }
    };
    return numeralFacet;
  }

  var add = function(property) {
    var facet = get(property.id);
    if (facet == null) {
      facet = createNew(property);
      numeralFacets.push(facet);
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
    var index = findIndex(numeralFacets, "id", id);
    return numeralFacets[index];
  }

  var clear = function() {
      numeralFacets.splice(0, numeralFacets.length);
  }

  return {
    numeralFacets: numeralFacets,
    add: add,
    get: get,
    clear: clear
  }
});

function findIndex(array, key, value) {
  for(var i = 0; i < array.length; i++) {
    if (array[i][key] === value) return i;
  }
  return -1;
}
