'use strict';

angular.module('search')

.factory('CseRequestService', function($q, $http) {
  function createSearchResultMetadata(responseData) {
    let searchResultMetadata = {
      searchKeyword: responseData.queries.request[0].searchTerms,
      searchTime: responseData.searchInformation.searchTime,
      totalResults: responseData.searchInformation.totalResults
    };
    if (responseData.spelling) {
      searchResultMetadata["spellingCorrection"] = responseData.spelling.correctedQuery;
    }
    return searchResultMetadata;
  }

  function createSearchResultItem(responseDataItem) {
    let searchResultItem = {
      source: "Google Custom Search",
      url: responseDataItem.link,
      title: responseDataItem.title,
      description: responseDataItem.snippet,
      responseData: responseDataItem
    };
    if (responseDataItem.pagemap) {
      let pagemap = responseDataItem.pagemap;
      if (pagemap.cse_image) {
        searchResultItem["image"] = pagemap.cse_image[0].src;
      }
      if (pagemap.cse_thumbnail) {
        searchResultItem["thumbnail"] = pagemap.cse_thumbnail[0].src;
      }
    }
    return searchResultItem;
  }

  var get = function(apiKey, searchEngineId, keyword, page) {
    let defer = $q.defer();
    let offset = 10;
    let url = 'https://www.googleapis.com/customsearch/v1' +
      '?key=' + apiKey +
      '&cx=' + searchEngineId +
      '&q=' + keyword +
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
