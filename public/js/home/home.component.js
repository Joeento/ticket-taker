angular.
    module('ticketTakerApp').
    component('home', {
        templateUrl: 'js/home/home.template.html',
        controller: ['$http', '$sce', function($http, $sce) {
			var self = this;

			//autocomplete logic
			self.movies = [];
			self.refreshMovies = function(query) {
				return $http.get(
					'/api/search',
					{
						params: {
							q: query
						}
					}
				).then(function(response) {
					self.movies = response.data;
				});
			}
			self.trustAsHtml = function(value) {
				return $sce.trustAsHtml(value);
			};
			
	}]
});