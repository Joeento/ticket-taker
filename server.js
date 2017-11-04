var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var request = require('request');

var config = require('./config');

mongoose.connect(config.mongo.url);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

/*
	/api/search
	Access Fandango's autocomplete API and convert their movie results to slugs that follow their format(sanitize name then append the ID).
*/
app.get('/api/search/', function(req, res) {
    var q = req.query.q;
    console.log(type);
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

app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(process.env.PORT || 8090);
console.log("App listening on port 8080");