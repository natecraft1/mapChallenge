var app = angular.module('myApp.userFeedFactory', []);
    
app.factory('userFeedFactory', ["$q", "$http", function($q, $http){
	var c = {}
    return {
       feedForUser: function(username) {
       		return c[username]
       },
       setFeedForUser: function(username, feed) {
       		c[username] = feed
       }
    }               
}]);
