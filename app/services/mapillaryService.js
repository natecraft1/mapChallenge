var app = angular.module('myApp.mapillaryService', []);
    
app.factory('mapillaryService', ["$q", "$http", function($q, $http){
	var cid = "MHc0eWNYYVRrTHBuRVRTYlFaWmt0QToyODY2OTBjYmU0NzJjMTgw"
	var urls = {
		user: function(username) {
			return "https://a.mapillary.com/v2/u/gyllen?client_id=" + cid
		}, 
		userFeed: function(username) {
			return "https://a.mapillary.com/v2/u/" + username + "/feed?client_id=" + cid 
		},
		userProfilePicture: function(username) {
			return "https://a.mapillary.com/v2/u/gyllen/profile.png?client_id=" + cid
		},
		globalFeed: function(options) {
			return "https://a.mapillary.com/v2/search/feed?client_id=" + cid + "&event_types=meblurrequested&event_types=meblurapplied&event_types=meblurdeclined&event_types=mechangesetrequested&event_types=mechangesetapplied&event_types=mechangesetdeclined&event_types=meaddedimagetosequence&event_types=meaddedimage&event_types=mecommentedonimage&limit=15&sort_by=updated_at"
		}
	}
    function fetchUrl(url) {
    	var deferred = $q.defer();
	     $http.get(url)
	       .success(function(data) { 
	          deferred.resolve(data);
	       }).error(function(msg, code) {
	          deferred.reject(msg);
	          console.log(msg, code);
	       });
	     return deferred.promise;
    }
    return {
        fetchUser: function(username) {
        	return fetchUrl(urls.user())
        },
        fetchUserFeed: function(username) {
        	return fetchUrl(urls.userFeed(username))
        },
        fetchUserProfilePicture: function(username) {
        	return fetchUrl(urls.userProfilePicture())
        },
        fetchGlobalFeed: function() {
        	return fetchUrl(urls.globalFeed())
        }
        
    }               
}]);
