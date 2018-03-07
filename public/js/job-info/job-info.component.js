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
							q: query,
							type: 'Movie'
						}
					}
				).then(function(response) {
					self.movies = response.data;
				});
			}
			self.refreshTheaters = function(query) {
				return $http.get(
					'/api/search',
					{
						params: {
							q: query,
							type: 'Theater'
						}
					}
				).then(function(response) {
					self.theaters = response.data;
				});
			}

			self.trustAsHtml = function(value) {
				return $sce.trustAsHtml(value);
			};

			self.save = function() {
				$http.post(
					'/api/jobs',
					{
						job: self.job.data,
						movie: self.movie,
						theater: self.theater
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
				self.theater = {
					id: self.job.data.theater.fandango_id,
					name: self.job.data.theater.name
				};
				self.job.data.time_start = new Date(self.job.data.time_start);
				self.job.data.time_end = new Date(self.job.data.time_end);
			};

        	//on bindings load into weird form
        	self.$onChanges = function (binding) {
        		self.fillForm();
        	}

			self.dateOptions = {
				dateDisabled: disabled,
				formatYear: 'yy',
				maxDate: new Date(2020, 5, 22),
				minDate: new Date(),
				startingDay: 1
			};

			function disabled(data) {
				var date = data.date, mode = data.mode;
				var today = new Date();
				return mode === 'day' && date < today;
			}

			self.openCalendar = function() {
				self.calendar.opened = true;
			};

			self.format = 'MMMM dd, yyyy';
			self.altInputFormats = ['M!/d!/yyyy'];

			self.calendar = {
				opened: false
			};
	}]
});