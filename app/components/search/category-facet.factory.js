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

  function findIndex(array, key, value) {
    for(var i = 0; i < array.length; i++) {
      if (array[i][key] === value) return i;
    }
    return -1;
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
});
