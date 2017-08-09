'use strict';

angular.module('search')

.factory('CseRequestService', function($q, $http) {
  var get = function(apiKey, searchEngineId, keyword, page) {
    var defer = $q.defer();
    var offset = 10;
    var url = 'https://www.googleapis.com/customsearch/v1' +
      '?key=' + apiKey +
      '&cx=' + searchEngineId +
      '&q=' + keyword +
      '&start=' + (((page - 1) * offset) + 1) +
      '&num=10';
    $http.get(url).then(
      function(response) {
        // Collect search metadata
        var searchMetadata = {
          searchKeyword: response.data.queries.request[0].searchTerms,
          searchTime: response.data.searchInformation.searchTime,
          totalResults: response.data.searchInformation.totalResults,
        };
        if (response.data.spelling) {
          searchMetadata['spellingCorrection'] = response.data.spelling.correctedQuery;
        }
        // Collect search result items
        var rawDataCollection = [];
        var responseItems = response.data.items;
        if (responseItems != null) {
          for (var i = 0; i < responseItems.length; i++) {
            rawDataCollection.push({
              source: "Google Custom Search",
              url: responseItems[i].link,
              title: responseItems[i].title,
              description: responseItems[i].snippet,
              responseData: responseItems[i]
            });
            var image = responseItems[i].pagemap.cse_image;
            if (image != null) {
              rawDataCollection[i]["image"] = image[0].src;
            }
            var thumbnail = responseItems[i].pagemap.cse_thumbnail;
            if (thumbnail != null) {
              rawDataCollection[i]["thumbnail"] = thumbnail[0].src;
            }
          }
        }
        defer.resolve({
          searchMetadata: searchMetadata,
          searchItems: rawDataCollection
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
