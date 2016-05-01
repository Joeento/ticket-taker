'use strict';

var request = require('request');
var cheerio = require('cheerio');

request('http://www.fandango.com/captainamerica:civilwar_185792/movietimes?location=11566&date=5%2f6%2f2016', function (error, response, html) {
	if (!error && response.statusCode === 200) {
		var $ = cheerio.load(html);
		$('div[itemtype="http://schema.org/MovieTheater"]').each(function(key, val) {
			var theater = $(val);
			var theaterName = theater.find('meta[itemprop="name"]').attr('content');
			if (theaterName === 'AMC Levittown 10') {
				theater.find($('span[itemtype="http://schema.org/TheaterEvent"]')).each(function(key, val) {
					var movie = $(val);
					var movieName = movie.find('meta[itemprop="name"]').attr('content');
					console.log(movieName);
					movie.find($('meta[itemprop="startDate"]')).each(function(key, val) {
						var showtime = $(val);
						console.log(showtime.attr("content"));
					});
				});
				return false;
			}
		});
	}
});