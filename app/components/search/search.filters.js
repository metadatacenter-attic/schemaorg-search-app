'use strict';

angular.module('search')

.filter('removeSeparator', function() {
  return function(input){
    var text = input.replace(/\s-\s/g, '|');
    var RegExp = /^([^|•:(+]+)/;
    var match = RegExp.exec(text);
    return match[1];
  };
});
