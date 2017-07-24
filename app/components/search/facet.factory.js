'use strict';

angular.module('search')

.factory('facetFactory', function() {
  var getCategorialFacet = function(property) {
    return {
      id: property.id,
      name: property.name,
      label: property.label,
      topic: property.domain.name,
      type: "categorial",
      visible: false,
      choices: []
    };
  };
  var getNumerialFacet = function($scope, property) {
    return {
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
        onChange: $scope.onSliderChanged
      }
    };
  };
  return {
    getCategorialFacet: getCategorialFacet,
    getNumerialFacet: getNumerialFacet
  };
});
