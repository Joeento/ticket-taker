angular.
    module('ticketTakerApp').
    component('jobList', {
    	bindings: { jobs: '<' },
        templateUrl: 'js/job-list/job-list.template.html',
        controller: ['$http', '$sce', function($http, $sce) {
			var self = this;
			function test() {
				console.log(self);
			}
			setTimeout(test, 5000)
			
	}]
});