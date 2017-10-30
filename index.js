'use strict';

var request = require('request');
var argv = require('yargs').argv;

var config = require('./config');
var client = require('twilio')(config.twilio.sid, config.twilio.token);


var zip = argv.zip;
var date = argv.date;
var movie_slug = argv.movie_slug;
var split = movie_slug.split('-');
var movie_id = split[split.length - 1];

var options = {
  url: 'https://www.fandango.com/napi/theaterShowtimeGroupings/' + movie_id + '/' + date +'?zip=' + zip + '&isdesktop=true&limit=5',
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
    		variant.amenityGroups.forEach(function(amenityGroup) {
    			amenityGroup.showtimes.forEach(function(showtime) {
    				var earlyBound = new Date(date + 'T17:00:00-04:00');
    				var showtimeDate = Date.parse(showtime.dateUtc);
    				var lateBound = new Date(date + 'T22:00:00-04:00');
    				if (argv.theater === theater.name && variant.formatName === "Standard" && earlyBound <= showtimeDate && showtimeDate <= lateBound) {
						console.log(showtime);
						var link = 'https://www.fandango.com/' + movie_slug + '/movie-times?date=' + date
						client.messages.create({
							to: config.toNumber,
							from: config.fromNumber,
							body: 'It\'s go time. ' + link
						}, function(err, message) {
							if (!err)
								console.log('Message sent: ' + message.date_created);
						});
	    			}
    			});
    			
    		});
    	});
    });
  }
}

request(options, callback);