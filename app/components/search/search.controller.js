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
    BreadcrumbService, FilterService, NerService, UserProfiles) {

  $scope.appVersion = 0.5;
  $scope.profileName = "default";
  $scope.profiles = UserProfiles;
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

    var profile = UserProfiles[$scope.profileName];
    var input = processUserInput(userInput);
    var userKeyword = input.keyword;
    var userChosenTopics = input.topics;

    $scope.userKeyword = userKeyword;
    $scope.spellingCorrection = "";
    $scope.searchInProgress = true;
    $scope.dataLoaded = false;

    var searchPromises = performSearchCall(CseRequestService, userKeyword, profile);
    Promise.all(searchPromises.map(settle)).then(resolvedCalls => {
      // Process and store the search results as the app data model
      resolvedCalls.filter(x => x.status === "resolved")
        .forEach(resolvedCall => {
          let searchResultMetadata = resolvedCall.value.searchResultMetadata;
          if (searchResultMetadata.spellingCorrection) {
            $scope.spellingCorrection = searchResultMetadata.spellingCorrection;
          }
          let searchResultItems = resolvedCall.value.searchResultItems;
          searchResultItems.forEach(searchResultItem => {
            CseDataService.add(searchResultItem, userChosenTopics);
          });
          $scope.$apply(() => {
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
          if (property.type === "enum") {
            CategoryFacetService.add($scope, property);
          } else if (property.type === "numeric") {
            RangeFacetService.add($scope, property);
          } else if (property.type === "duration") {
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
