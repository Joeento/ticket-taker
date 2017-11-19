angular.
    module('ticketTakerApp').
    component('jobInfo', {
        templateUrl: 'js/job-info/job-info.template.html',
        bindings: { jobs: '<' },
        controller: ['$http', function($http) {
			var self = this;
			console.log('yhryhj');
			
	}]
});