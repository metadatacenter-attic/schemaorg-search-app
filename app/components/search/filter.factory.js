'use strict';

angular.module('search')

.factory('FilterService', function() {
  var filterModel = [];

  function createNew(facet) {
    var filter = {
      id: facet.id,
      name: facet.name,
      type: facet.type,
      topic: facet.topic,
      visible: facet.visible,
      values: []
    };
    return filter;
  }

  function findIndex(arr, key, value) {
    for(var i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) return i;
    }
    return -1;
  }

  function updateChoices(filter, choices) {
    filter.values.splice(0, filter.values.length); // reset the filter values
    for (var i = 0; i < choices.length; i++) {
      var choice = choices[i];
      if (choice.selected) {
        filter.values.push(choice.value);
      }
    }
  }

  function updateRanges(filter, minValue, maxValue) {
    filter.values[0] = minValue;
    filter.values[1] = maxValue;
  }

  var add = function(facet) {
    var filter = get(facet.id);
    if (filter == null) {
      filter = createNew(facet);
      filterModel.push(filter);
    }
    if (facet.type === "category") {
      updateChoices(filter, facet.choices);
    } else if (facet.type === "range") {
      updateRanges(filter, facet.minValue, facet.maxValue);
    }
  }

  var remove = function(id) {
    var index = findIndex(filterModel, "id", id);
    if (index != -1) {
      filterModel.splice(index, 1);
    }
  }

  var get = function(id) {
    var index = findIndex(filterModel, "id", id);
    return filterModel[index];
  }

  var size = function() {
    return filterModel.length;
  }

  var isEmpty = function() {
    return size() == 0;
  }

  var evaluate = function(item) {
    var evalOnEachFilter = [];
    for (var i = 0; i < size(); i++) {
      var filter = filterModel[i];
      evalOnEachFilter[i] = (item.topics.length == 0) || item.topics.includes(filter.topic);
      for (var j = 0; j < item.properties.length; j++) {
        var property = item.properties[j];
        if (property.domain.name === filter.topic && property.name === filter.name) {
          if (filter.type === "category") {
            evalOnEachFilter[i] = evalOnEachFilter[i]
                && filter.values.includes(property.value);
          } else if (filter.type === "range") {
            evalOnEachFilter[i] = evalOnEachFilter[i]
                && property.value >= filter.values[0]
                && property.value <= filter.values[1];
          }
        }
      }
    }
    return evalOnEachFilter.reduce((a, b) => { return a && b; });
  }

  var clear = function() {
    filterModel.splice(0, filterModel.length);
  }

  return {
    filterModel: filterModel,
    add: add,
    remove: remove,
    get: get,
    size: size,
    isEmpty: isEmpty,
    evaluate: evaluate,
    clear: clear
  }
});
