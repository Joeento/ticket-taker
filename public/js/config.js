angular.
    module('ticketTakerApp').config(function($stateProvider) {
    	var homeState = {
    		name: 'home',
    		url: '',
    		component: 'home'
    	};

    	var jobListState = {
    		name: 'jobs',
    		url: '/jobs',
    		component: 'jobList',
    		resolve: {
				jobs: function($http) {
					return $http.get('/api/jobs');
				}
			}
    	};

		var jobState = { 
			name: 'job', 
			url: '/job/{jobId}', 
			component: 'jobInfo',
			resolve: {
				job: function($http, $stateParams) {
					if (!$stateParams.jobId) {
						return null;
					}
					return $http.get('api/jobs/' + $stateParams.jobId);
				}
			}
		};
		$stateProvider.state(homeState);
		$stateProvider.state(jobListState);
		$stateProvider.state(jobState);

});