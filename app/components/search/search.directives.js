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
})

.directive('topicAutocomplete', ['SchemaorgVocab',
function(SchemaorgVocab) {
  function split(value) {
    return value.split(/ \s*/);
  }
  function extractLast(term) {
    return split(term).pop();
  }
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      element.bind("keydown", function(event) {
        if (event.keyCode === $.ui.keyCode.TAB
            && $(this).autocomplete("instance").menu.active) {
          event.preventDefault();
        }
      })
      .autocomplete({
        minLength: 0,
        source: function(request, response) {
          // delegate back to autocomplete, but extract the last term
          var lastword = extractLast(request.term);
          if (lastword.length > 0) {
            // Regexp for filtering those inputs that start with '#'
            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(lastword), "i");
            // Get all topic terms
            var terms = Object.keys(SchemaorgVocab).map(function(item) {
              return "#" + item;
            });
            var results = $.grep(terms, function(item) {
              return matcher.test(item);
            });
            response($.ui.autocomplete.filter(results, lastword));
          }
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        },
        select: function(event, ui) {
          var terms = split(this.value);
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push(ui.item.value);
          // add placeholder to get the comma-and-space at the end
          terms.push("");
          this.value = terms.join(" ");
          return false;
        },
        open: function(event, ui) {
          var input = $(event.target),
            widget = input.autocomplete("widget"),
            style = $.extend(input.css([
              "font",
              "border-left",
              "padding-left"
            ]), {
              "position": "absolute",
              "visibility": "hidden",
              "padding-right": 0,
              "border-right": 0,
              "white-space": "pre",
            }),
            div = $("<div/>"),
            pos = {
              my: "left top",
              collision: "none"
            },
            offset = 50;

          widget.css("width", "");
          div.text(input.val().replace(/\S*$/, ""))
            .css(style)
            .insertAfter(input);
          offset = Math.min(
            Math.max(offset + div.width()/2 + input.width()/2, 0),
            input.width() - widget.width()
          );
          div.remove();

          pos.at = "left+" + offset + " bottom";
          input.autocomplete("option", "position", pos);
          widget.position($.extend({
            of: input
          }, pos));
        }
      });
    }
  }
}]);
