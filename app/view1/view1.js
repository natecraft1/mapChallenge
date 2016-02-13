'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ["$scope", "$q", '$interval', "mapillaryService", "userFeedFactory",  function($scope, $q, $interval, mapillaryService, userFeedFactory) {

	var colorI = 0
	var eventTypeColors = ["red", "green", "blue", "orange", "yellow"]

	$scope.usernames = ["No data", "gyllen", "natecraft", "jesolem", "richlv", "pbokr", "luislatin", "teddy73", "ricardoggoncalves", "ottokar", "raul"]
	$scope.activeUserColumns = {}
	$scope.globalUserActivity = []
	$scope.eventTypes = {}

	$scope.toggleActiveUser = function(username) {
		if (!localStorage.getItem(username) && !userFeedFactory.feedForUser(username)) {
			mapillaryService.fetchUserFeed(username).then(function(data) {
				userFeedFactory.setFeedForUser(username, data.feed)
				$scope.activeUserColumns[username] = data.feed
				localStorage.setItem(username, JSON.stringify(data.feed))

			})
		} else if (!$scope.activeUserColumns[username]) { 
			addActiveUserColumn(username)
		} else {
			removeActiveUserColumn(username)
		}
	}
	
	$scope.setEventType = function(eventName) {
		$scope.eventTypes[eventName] = eventTypeColors[colorI++ % eventTypeColors.length]
	}

	function fetchGlobalFeed() {
		mapillaryService.fetchGlobalFeed().then(function(data) {
			$scope.globalUserActivity = data.feed
		})
	}

	function addActiveUserColumn(username) {
		$scope.activeUserColumns[username] = JSON.parse(localStorage.getItem(username)) && userFeedFactory.feedForUser(username)
	}
	
	function removeActiveUserColumn(username) {
		delete $scope.activeUserColumns[username]
		localStorage.removeItem(username)
	}

	$interval(function() {
		fetchGlobalFeed()
	}, 6000)
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