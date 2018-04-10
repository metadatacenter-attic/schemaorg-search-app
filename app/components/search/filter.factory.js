'use strict';

angular.module('search')

.factory('FilterService', function() {
  var filterModel = [];

  function createNew(facet) {
    var filter = {
      id: facet.id,
      type: facet.type,
      topic: facet.topic,
      values: []
    };
    return filter;
  }

  function findIndex(arr, key, value) {
    const idx = [];
    for(var i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) {
        idx.push(i);
      }
    }
    return idx;
  }

  function evaluateDataOnEachFilter(data, filter) {
    let answer = false;
    if (data.topics.includes(filter.topic)) {
      answer = evaluateQuery(data, filter);
    }
    return answer;
  }

  function evaluateQuery(data, filter) {
    let answer = false;
    let hits = findIndex(data.properties, "id", filter.id);
    if (hits.length > 0) {
      if (filter.values.length == 0) {
        answer = true;
      } else {
        hits.forEach(function(index) {
          let value = data.properties[index].value;
          if (value) {
            if (filter.type === "category") {
              answer = answer || filter.values.includes(value);
            } else if (filter.type === "range") {
              answer = answer || (value >= filter.values[0] && value <= filter.values[1]);
            }
          }
        });
      }
    }
    return answer;
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
      filterModel.push(createNew(facet));
    }
    update(facet);
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

  var update = function(facet) {
    var filter = get(facet.id);
    if (filter != null) {
      if (facet.type === "category") {
        updateChoices(filter, facet.choices);
      } else if (facet.type === "range") {
        updateRanges(filter, facet.minValue, facet.maxValue);
      }
    }
  }

  var evaluate = function(data) {
    var answer = true;
    if (filterModel.length > 0) {
      var evalOnEachFilter = [];
      for (var i = 0; i < filterModel.length; i++) {
        var filter = filterModel[i];
        console.log("Filtering items that have '" + filter.id + "' with value [" + filter.values + "]");
        evalOnEachFilter[i] = evaluateDataOnEachFilter(data, filter);
      }
      // Combine each filter evaluation with the AND operation
      answer = evalOnEachFilter.reduce((a, b) => { return a && b; }, true);
    }
    return answer;
  }

  var clear = function() {
    filterModel.splice(0, filterModel.length);
  }

  return {
    filterModel: filterModel,
    add: add,
    remove: remove,
    get: get,
    update: update,
    evaluate: evaluate,
    clear: clear
  }
});
