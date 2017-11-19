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

			self.$onChanges = function({binding}) {
				console.log({binding});
				if (angular.isDefined(binding)) {
					console.log({
						currentValue: binding.currentValue, 
						isFirstChange: binding.isFirstChange()
					});
          		}
        	}

        	//on bindings load
        	self.$onChanges = function (binding) {
				self.job.data.time_start = new Date(self.job.data.time_start);
				self.job.data.time_end = new Date(self.job.data.time_end);
			};
	}]
});