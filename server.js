var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var request = require('request');

var config = require('./config');

var Job = require('./models/Job');
var Movie = require('./models/Movie');
var Theater = require('./models/Theater');

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
    var type = req.query.type ? req.query.type : 'Movie';
	request('https://www.fandango.com/api/search/autocompletemulti?q=' + q + '&callback=callback&_=' + Date.now(), function(error, response, body) {
		var response = [];
		var callback = function(results) {
			results.forEach(function(result) {
				if (result.Type === type) {
					var obj = {
						id: result.Id,
						name: result.Name,
					}
					if (type === 'Movie') {
						var movie_slug = result.Name;
						movie_slug = movie_slug.toLowerCase();
						movie_slug = movie_slug.replace(/[\s\(\)]/g, '');
						movie_slug = movie_slug + '-' + result.Id.substr(1);
						obj.slug = movie_slug;
					}
					response.push(obj);
				}
			});
			res.json(response);
		}
		eval(body);
	});
    
});

app.get('/api/jobs', function(req, res) {
	Job.find().populate('movie').populate('theater').exec(function(err, jobs) {
		if (err) throw err;
		res.json(jobs);
	});
});

app.post('/api/jobs', function(req, res) {
    var new_job = req.body.job;
    var movie = req.body.movie;
    var theater = req.body.theater;
    Job.findById(new_job._id).exec(function(err, job) {
    	if (!job) {
			var job = new Job({});
    	}
		job.theater = new_job.theater;
        job.time_start = new Date(new_job.time_start),
        job.time_end = new Date(new_job.time_end)
        saveMovie(movie, function(movie_id) {
        	job.movie = movie_id;
        	saveTheater(theater, function(theater_id) {
        		job.theater = theater_id;
	        	job.save(function(err, job) {
					Job.findById(job._id).populate('movie').populate('theater').exec(function(err, job) {
						res.json(job);
					});
				});
	        });
        })
    });
});

app.get('/api/jobs/:job_id', function(req, res) {
	Job.findById(req.params.job_id).populate('movie').populate('theater').exec(function(err, job) {
		if (err) throw err;
		res.json(job);
	});
});

app.post('/api/jobs/:job_id/toggle', function(req, res) {
	var job_id = req.params.job_id;
	Job.findById(job_id, function(err, job) {
		if (err) throw err;
		job.active = req.body.state ? req.body.state : !job.active;
		job.save(function(err) {
			if (err) throw err;
			res.json(job);
		})
	});
});

app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(process.env.PORT || 8090);
console.log("App listening on port 8080");

//helper functions
function saveMovie(fandango_movie, callback) {
	Movie.findOne({fandango_id: fandango_movie.id}, function(err, movie) {
		if (err) throw err;
		if (!movie) {
			var movie = new Movie({
				name: fandango_movie.name,
				fandango_id: fandango_movie.id,
				fandango_slug: fandango_movie.slug,
	        });
		}
		movie.save(function(err, m) {
			callback(m._id);
		});
	})
}
function saveTheater(fandango_theater, callback) {
	Theater.findOne({fandango_id: fandango_theater.id}, function(err, movie) {
		if (err) throw err;
		if (!theater) {
			var theater = new Theater({
				name: fandango_theater.name,
				fandango_id: fandango_theater.id,
	        });
		}
		theater.save(function(err, t) {
			callback(t._id);
		});
	})
}