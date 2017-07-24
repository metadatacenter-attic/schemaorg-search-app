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
      visible: true,
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
// });
//
//
//   var getCategorialFacet = function(property) {
//     return {
//       id: property.id,
//       name: property.name,
//       label: property.label,
//       topic: property.domain.name,
//       type: "categorial",
//       visible: false,
//       choices: []
//     };
//   };
//   var getNumerialFacet = function($scope, property) {
//     return {
//       id: property.id,
//       name: property.name,
//       label: property.label,
//       topic: property.domain.name,
//       type: "numeral",
//       visible: false,
//       unit: property.unit,
//       minValue: Number.MAX_SAFE_INTEGER,
//       maxValue: Number.MIN_SAFE_INTEGER,
//       options: {
//         id: property.id,
//         floor: Number.MAX_SAFE_INTEGER,
//         ceil: Number.MIN_SAFE_INTEGER,
//         step: 1,
//         hideLimitLabels: true,
//         onChange: $scope.onSliderChanged
//       }
//     };
//   };
//   return {
//     getCategorialFacet: getCategorialFacet,
//     getNumerialFacet: getNumerialFacet
//   };
});

function findIndex(array, key, value) {
  for(var i = 0; i < array.length; i++) {
    if (array[i][key] === value) return i;
  }
  return -1;
}
