'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ["$scope", "$q", '$timeout', "mapillaryService", "userFeedFactory",  function($scope, $q, $timeout, mapillaryService, userFeedFactory) {

	var colorI = 0
	var eventTypeColors = ["red", "green", "blue", "orange", "yellow"]

	$scope.usernames = ["gyllen", "natecraft", "jesolem", "richlv", "pbokr", "luislatin", "teddy73", "katrinhumal", "ottokar", "raul"]
	localStorage.activeUserColumns = {}
	$scope.activeUserColumns = localStorage.activeUserColumns
	$scope.globalUserActivity = []
	$scope.eventTypes = {}

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
	
	$scope.setEventType = function(eventName) {
		$scope.eventTypes[eventName] = eventTypeColors[colorI++%eventTypeColors.length]
	}
	
	function fetchGlobalFeed() {
		mapillaryService.fetchGlobalFeed().then(function(data) {
			$scope.globalUserActivity = data.feed
		})
	}

	fetchGlobalFeed()

}]).directive('feedItem', function() {
  return {
  	scope: {
  		eventInfo: "=",
  		eventTypes: "=",
  		setEventType: "="
  	},
  	link: function(scope, elements, attrs) {
  		if (!scope.eventTypes[scope.eventInfo.action]) {
  			scope.setEventType(scope.eventInfo.action)
  		}
  	},
    template: '<div class="event-box" style="border-color:{{eventTypes[eventInfo.action]}}"> \
    	Username: {{eventInfo.user}} <br/> \
    	Event: {{eventInfo.action}} <br/> \
    	Description: {{eventInfo.main_description}} <br/> \
    	<img class="event-img" src={{eventInfo.image_url}}> \
    	</div>'
  };
});