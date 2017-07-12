var app = angular.module('schemaorg', [], function($provide) {
	// Fixes'history.pushState is not available in packaged apps' error message
	// Source: https://github.com/angular/angular.js/issues/11932
  $provide.decorator('$window', function($delegate) {
    Object.defineProperty($delegate, 'history', {get: function(){ return null; }});
    return $delegate;
	});
});

app.controller('SearchController', function($scope, $http) {
	$scope.doSearch = function() {
		$scope.result = []
		offset = 10;
		repeat = 4
		for (i = 1; i <= repeat; i++) {
			var url = 'https://www.googleapis.com/customsearch/v1' +
								'?key=AIzaSyC0tYdp3uFxDdgJO4t5hZNznH7qsBFHFRw' +
								'&cx=000084546530648272235:2a0v4vyk8nu' +
								'&q=' + $scope.keyword +
								'&start=' + (((i-1) * offset) + 1) +
								'&num=10';
		  $http.get(url).
		  	then(function(response) {
		      $scope.result = $scope.result.concat(response.data.items);
					$scope.result_size = $scope.result.length;
		    },
		    function(err) {
		      // TODO: Handle error
		    });
		}
  }
});

chrome.storage.onChanged.addListener(function(changes, namespace){
	if(changes.data) {
		// TODO: Do something
	}
})
