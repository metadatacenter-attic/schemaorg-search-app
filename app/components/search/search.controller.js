'use strict';

angular.module('search')

.controller('searchController', [
  '$scope',
  'CseRequestService',
  'CseDataService',
  'CategoryFacetService',
  'RangeFacetService',
  'BreadcrumbService',
  'FilterService',
  'NerService',
  'UserProfiles',

function($scope, CseRequestService, CseDataService, CategoryFacetService, RangeFacetService,
    BreadcrumbService, FilterService, NerService, userProfiles) {

  $scope.appVersion = 0.4;
  $scope.profileName = "default";
  $scope.profiles = userProfiles;
  $scope.structuredSearchResults = [];
  $scope.nonStructuredSearchResults = [];
  $scope.categoryFacets = CategoryFacetService.categoryFacets;
  $scope.rangeFacets = RangeFacetService.rangeFacets;
  $scope.filters = FilterService.filterModel;
  $scope.breadcrumbs = BreadcrumbService.breadcrumbs;

  $scope.doSearch = function(userInput) {
    if (userInput == null) {
      return;
    }

    resetServices();

    var profile = userProfiles[$scope.profileName];
    var input = processUserInput(userInput);
    var userKeyword = input.keyword;
    var userTopics = input.topics;

    $scope.userKeyword = userKeyword;
    $scope.searchInProgress = true;
    $scope.dataLoaded = false;

    var searchPromises = performSearchCall(CseRequestService, userKeyword, profile);
    Promise.all(searchPromises.map(settle)).then(resolvedCalls => {
      // Process and store the search results as the app data model
      resolvedCalls.filter(x => x.status === "resolved")
        .forEach(resolvedCall => {
          var response = resolvedCall.value;
          var searchItems = response.searchItems;
          for (var i = 0; i < searchItems.length; i++) {
            var rawData = searchItems[i];
            CseDataService.add(rawData, userTopics);
          }
          $scope.$apply(() => {
            if (response.searchMetadata.spellingCorrection) {
              $scope.spellingCorrection = response.searchMetadata.spellingCorrection;
            }
            $scope.structuredSearchResults = CseDataService.structuredData;
            $scope.nonStructuredSearchResults = CseDataService.nonStructuredData;
            $scope.searchInProgress = false;
            $scope.dataLoaded = true;
          });
        });
      // Create search facets based on the structured data found in the search results
      CseDataService.structuredData.forEach(data => {
        var properties = data.properties;
        for (var j = 0; j < properties.length; j++) {
          var property = properties[j];
          if (property.range === "enum") {
            CategoryFacetService.add($scope, property);
          } else if (property.range === "numeric") {
            RangeFacetService.add($scope, property);
          } else if (property.range === "duration") {
            RangeFacetService.add($scope, property);
          }
        }
      });
      // Find the related concepts based on the search results text
      $scope.relatedConcepts = NerService.findConcepts(
          CseDataService.structuredData,
          [$scope.userKeyword]); // the exclusion list
      // Create the breadcrumbs based on the search facets
      $scope.$apply(() => {
        BreadcrumbService.batchUse([
            CategoryFacetService.categoryFacets,
            RangeFacetService.rangeFacets]);
      });
    });
  };

  $scope.onOpen = function(facet) {
    facet.visible = true;
    FilterService.add(facet);
  }

  $scope.onClose = function(facet) {
    facet.visible = false;
    FilterService.remove(facet.id);
    // Reset the values
    if (facet.type === "category") {
      CategoryFacetService.reset(facet.id);
    } else if (facet.type === "range") {
      RangeFacetService.reset(facet.id);
    }
  }

  $scope.onCheckboxChanged = function(facet) {
    FilterService.update(facet);
  }

  $scope.onSliderChanged = function(id) {
    var facet = RangeFacetService.get(id);
    FilterService.update(facet);
  }

  $scope.$watch(function() {
    return FilterService.filterModel;
  },
  function() {
    var filteredData = CseDataService.structuredData.filter(data => {
      return FilterService.evaluate(data);
    });
    $scope.structuredSearchResults = filteredData;
    $scope.relatedConcepts = NerService.findConcepts(filteredData,
        [$scope.userKeyword]);
  }, true);

  function resetServices() {
    CseDataService.clear();
    CategoryFacetService.clear();
    RangeFacetService.clear();
    BreadcrumbService.clear();
    FilterService.clear();
  }

  function processUserInput(input) {
    var bagOfKeywords = input.split('#').map(str => { return str.trim(); });
    var keyword = bagOfKeywords[0];
    return {
      keyword: keyword,
      topics: bagOfKeywords.filter(str => { return str != keyword })
    }
  }

  function performSearchCall(CseRequestService, userKeyword, profile) {
    var searchPromises = [];
    for (var page = 1; page <= profile.pageLimit; page++) {
      var promise = CseRequestService.get(
          profile.apiKey,
          profile.searchEngineId,
          userKeyword, page);
      searchPromises.push(promise);
    }
    return searchPromises;
  }

  // Solution for handling request failure gracefully in Promise.all
  // Source: https://stackoverflow.com/questions/31424561/wait-until-all-es6-promises-complete-even-rejected-promises
  function settle(promise) {
    return promise.then(function(v){ return {value:v, status: "resolved" }},
                        function(e){ return {value:e, status: "rejected" }});
  }
}]);
