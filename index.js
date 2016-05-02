'use strict';

var request = require('request');
var cheerio = require('cheerio');
var yargs = require('yargs');
var argv = require('yargs').argv;

var config = require('./config');
var client = require('twilio')(config.twilio.sid, config.twilio.token);
 
var url = 'http://www.fandango.com/captainamerica:civilwar_185792/movietimes?location=' + argv.zip + '&date=' + argv.date;
request(url, function (error, response, html) {
	if (!error && response.statusCode === 200) {
		var $ = cheerio.load(html);
		$('div[itemtype="http://schema.org/MovieTheater"]').each(function(key, val) {
			var theater = $(val);
			var theaterName = theater.find('meta[itemprop="name"]').attr('content');
			if (theaterName === argv.theater) {
				theater.find($('span[itemtype="http://schema.org/TheaterEvent"]')).each(function(key, val) {
					var movie = $(val);
					var movieName = movie.find('meta[itemprop="name"]').attr('content');
					if (movieName === 'Captain America: Civil War') {
						if (movie.find($('meta[itemprop="startDate"]')).length > 2) {
							console.log(true);
							client.messages.create({
								to: config.toNumber,
								from: config.fromNumber,
								body: 'It\'s go time.' + url
							}, function(err, message) {
								if (!err)
									console.log('Message sent: ' + message.date_created);
							});
						} else {
							console.log(false);
						}
						return false;
					}
				});
				return false;
			}
		});
	}
});