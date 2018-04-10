'use strict';

angular.module('search')

.factory('GrottoRequestService', function($q, $http) {
  function createSearchResultMetadata(responseData) {
    let searchResultMetadata = {
      searchKeyword: responseData.searchInformation.searchTerms,
      searchTime: responseData.searchInformation.searchTime,
      totalResults: responseData.searchInformation.totalResults
    };
    return searchResultMetadata;
  }

  function createSearchResultItem(responseDataItem) {
    let searchResultItem = {
      source: "Grotto Search API",
      url: responseDataItem.link,
      title: responseDataItem.title,
      description: responseDataItem.snippet,
      responseData: responseDataItem
    };
    return searchResultItem;
  }

  var get = function(apiKey, searchEngineId, keyword, page) {
    let defer = $q.defer();
    let offset = 10;
    let url = 'http://localhost:3000/query?' +
      'q=' + keyword +
      '&start=' + (((page - 1) * offset) + 1) +
      '&num=10';
    $http.get(url).then(
      function(response) {
        let searchResultMetadata = createSearchResultMetadata(response.data);
        let searchResultItems = [];
        if (response.data.items) {
          response.data.items.forEach(responseDataItem => {
            let searchResultItem = createSearchResultItem(responseDataItem);
            searchResultItems.push(searchResultItem);
          });
        }
        defer.resolve({
          searchResultMetadata: searchResultMetadata,
          searchResultItems: searchResultItems
        });
      },
      function(err) {
        defer.reject(err);
      });
    return defer.promise;
  };

  return {
    get: get
  };
});
