'use strict';

var request = require('request');
var cheerio = require('cheerio');
var yargs = require('yargs');
var argv = require('yargs').argv;

var config = require('./config');
var client = require('twilio')(config.twilio.sid, config.twilio.token);


var zip = argv.zip;
var date = argv.date;
var movie_slug = argv.movie_slug;
var split = movie_slug.split('-');
var movie_id = split[split.length - 1];

var options = {
  url: 'https://www.fandango.com/napi/theaterShowtimeGroupings/' + movie_id + '/' + date +'?zip=' + zip + '&lat=40.65&long=-73.55&isdesktop=true&limit=5',
  headers: {
    'cookie': config.fandango.cookie,
    'referer': 'https://www.fandango.com/' + movie_slug + '/movie-times?location=' + zip +'&date=' + date
  }
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var data = JSON.parse(body);
    data.theaterShowtimes.theaters.forEach(function(theater) {
    	console.log(theater.name);
    	theater.variants.forEach(function(variant) {
    		//if (variant.formatName === "Standard") {
    			variant.amenityGroups.forEach(function(amenityGroup) {
    				console.log(amenityGroup.showtimes);
    			});
    		//}
    	});
    });
  }
}

request(options, callback);