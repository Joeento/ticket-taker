angular.
    module('ticketTakerApp').
    component('jobList', {
    	bindings: { jobs: '<' },
        templateUrl: 'js/job-list/job-list.template.html',
        controller: ['$http', '$sce', function($http, $sce) {
			var self = this;
			self.toggleJob = function(job_id) {
				self.jobs.data.forEach(function(job) {
					if (job._id === job_id) {
						$http.post(
							'/api/jobs/' + job_id + '/toggle',
							{
								state: job.active
							}
						)
					}
				});
				
			}
			
	}]
});