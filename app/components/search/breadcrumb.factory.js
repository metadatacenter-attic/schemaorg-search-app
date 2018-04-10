'use strict';

angular.module('search')

.factory('BreadcrumbService', [
  'SchemaOrgVocab',

function(SchemaOrgVocab) {
  var breadcrumbs = [];

  function createNew(facet) {
    var breadcrumb = {
      id: facet.topic,
      topic: {
        id: SchemaOrgVocab[facet.topic].id,
        label: SchemaOrgVocab[facet.topic].label
      },
      facets: []
    };
    return breadcrumb;
  }

  function findIndex(array, key, value) {
    for(var i = 0; i < array.length; i++) {
      if (array[i][key] === value) return i;
    }
    return -1;
  }

  var use = function(facets) {
    if (!Array.isArray(facets)) {
      facets = [ facets ];
    }
    for (var i = 0; i < facets.length; i++) {
      var facet = facets[i];
      var breadcrumb = get(facet.topic);
      if (breadcrumb == null) {
        breadcrumb = createNew(facet);
        breadcrumbs.push(breadcrumb);
      }
      breadcrumb.facets.push(facet);
    }
  }

  var batchUse = function(arrayOfFacets) {
    arrayOfFacets.forEach(facets => {
      use(facets);
    });
  }

  var get = function(id) {
    var index = findIndex(breadcrumbs, "id", id);
    return breadcrumbs[index];
  }

  var clear = function() {
    breadcrumbs.splice(0, breadcrumbs.length);
  }

  return {
    breadcrumbs: breadcrumbs,
    use: use,
    batchUse: batchUse,
    get: get,
    clear: clear
  }
}]);
