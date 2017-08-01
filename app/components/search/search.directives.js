'use strict';

angular.module('search')

.directive("spellingCorrection",
function() {
  /*
   * An example of search query with topic selections:
   * `pancake #recipe #nutritioninformation`
   *
   * This function will extract the substring that
   * begins with a hash, such that using the example
   * above, it will return "#recipe #nutritioninformation"
   */
  function getTopicQuery(input) {
    var topicQuery = "";
    var topicHashPosition = input.indexOf("#");
    if (topicHashPosition != -1) {
      topicQuery = input.substr(topicHashPosition);
    }
    return topicQuery;
  }
  return {
    restrict: 'A',
    link: function(scope , element, attrs) {
      element.bind("click", function() {
        var searchInputId = attrs.searchInputId;
        var searchBar = document.getElementById(searchInputId);

        var correctSpelling = attrs.value;
        var newUserInput = correctSpelling;
        var topicQuery = getTopicQuery(searchBar.value);
        if (topicQuery.length > 0) {
          newUserInput = correctSpelling + " " + topicQuery;
        }
        searchBar.value = newUserInput;
        scope.doSearch(newUserInput);
      });
    }
  }
});
