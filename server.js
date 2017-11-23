var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var request = require('request');

var config = require('./config');

var Job = require('./models/Job');
var Movie = require('./models/Movie');

mongoose.connect(config.mongo.url);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

/*
	/api/search
	Access Fandango's autocomplete API and convert their movie results to slugs that follow their format(sanitize name then append the ID).
*/
app.get('/api/search', function(req, res) {
    var q = req.query.q;
	request('https://www.fandango.com/api/search/autocompletemulti?q=' + q + '&callback=callback&_=' + Date.now(), function(error, response, body) {
		var movies = [];
		var callback = function(results) {
			results.forEach(function(result) {
				if (result.Type === 'Movie') {
					var movie_slug = result.Name;
					movie_slug = movie_slug.toLowerCase();
					movie_slug = movie_slug.replace(/[\s\(\)]/g, '');
					movie_slug = movie_slug + '-' + result.Id.substr(1);

					movies.push({
						id: result.Id,
						name: result.Name,
						slug: movie_slug
					});
				}
			});
			res.json(movies);
		}
		eval(body);
	});
    
});

app.get('/api/jobs', function(req, res) {
	Job.find().populate('movie').exec(function(err, jobs) {
		if (err) throw err;
		res.json(jobs);
	});
});

app.post('/api/jobs', function(req, res) {
    var new_job = req.body.job;

    Job.findById(new_job._id).exec(function(err, job) {
    	if (!job) {
			var job = new Job({});
			
    	}
		job.theater = new_job.theater;
        job.time_start = new Date(new_job.time_start),
        job.time_end = new Date(new_job.time_end)
        job.save(function(err, job) {
			Job.findById(job._id).populate('movie').exec(function(err, job) {
				res.json(job);
			})
		});
    });
});

app.get('/api/jobs/:job_id', function(req, res) {
	Job.findById(req.params.job_id).populate('movie').exec(function(err, job) {
		if (err) throw err;
		res.json(job);
	});
});

app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(process.env.PORT || 8090);
console.log("App listening on port 8080");