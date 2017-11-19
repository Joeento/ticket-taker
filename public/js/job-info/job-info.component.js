angular.
    module('ticketTakerApp').
    component('jobInfo', {
        templateUrl: 'js/job-info/job-info.template.html',
        bindings: { job: '<' },
        controller: ['$http', '$sce', function($http, $sce) {
			var self = this;
			console.log(self);

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