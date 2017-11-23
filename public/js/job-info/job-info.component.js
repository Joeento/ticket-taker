angular.
    module('ticketTakerApp').
    component('jobInfo', {
        templateUrl: 'js/job-info/job-info.template.html',
        bindings: { job: '<' },
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

			self.save = function() {
				$http.post(
					'/api/jobs',
					{
						job: self.job.data
					}
				).then(function(response) {
					self.job = response;
					self.fillForm();
				});
			
			}

			self.fillForm = function() {
				if (!self.job) {
        			return;
        		}
				self.movie = {
					id: self.job.data.movie.fandango_id,
					name: self.job.data.movie.name,
					slug: self.job.data.movie.fandango_slug
				};
				self.job.data.time_start = new Date(self.job.data.time_start);
				self.job.data.time_end = new Date(self.job.data.time_end);
			};
			

        	//on bindings load into weird form
        	self.$onChanges = function (binding) {
        		self.fillForm();
        	}
	}]
});