'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ["$scope", "$q", "mapillaryService", "userFeedFactory", function($scope, $q, mapillaryService, userFeedFactory) {

	$scope.usernames = ["gyllen", "natecraft", "jesolem", "travel_193", "uddback"]
	$scope.activeUserColumns = {}
	$scope.globalUserActivity = []

	$scope.activateUserFeed = function(username) {
		if (!userFeedFactory.feedForUser(username)) {
			mapillaryService.fetchUserFeed(username).then(function(data) {
				userFeedFactory.setFeedForUser(username, data.feed)
				$scope.activeUserColumns[username] = data.feed
			})
		} else if (!$scope.activeUserColumns[username]) { 
			$scope.activeUserColumns[username] = userFeedFactory.feedForUser(username)
		} else {
			delete $scope.activeUserColumns[username]
		}
	}

	mapillaryService.fetchUser().then(function(data) {
		console.log(data)
	})

	mapillaryService.fetchUserProfilePicture().then(function(data) {
		console.log(data)
	})
	
	mapillaryService.fetchGlobalFeed().then(function(data) {

		$scope.globalUserActivity = data.feed
	})

}]).directive('feedItem', function() {
	console.log("scope from directive", $scope)
  return {
    template: 'Name: {{username}}'
  };
});