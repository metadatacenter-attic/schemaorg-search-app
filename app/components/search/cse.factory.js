'use strict';

angular.module('search')

.factory('searchCall', function($q, $http) {
  var exec = function(apiKey, searchEngineId, keyword, page) {
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
        var rawDataCollection = [];
        var responseItems = response.data.items;
        for (var i = 0; i < responseItems.length; i++) {
          rawDataCollection.push({
            source: "Google Custom Search",
            url: responseItems[i].link,
            title: responseItems[i].title,
            description: responseItems[i].snippet,
            raw: responseItems[i]
          })
        }
        defer.resolve(rawDataCollection);
      },
      function(err) {
        defer.reject(err);
      });
    return defer.promise;
  };
  return {
    exec: exec
  };
});
