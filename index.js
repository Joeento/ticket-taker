'use strict';

var request = require('request');
var cheerio = require('cheerio');

request('http://www.fandango.com/captainamerica:civilwar_185792/movietimes?location=11566&date=5%2f6%2f2016', function (error, response, html) {
	if (!error && response.statusCode === 200) {
		var $ = cheerio.load(html);
		$('div[itemtype="http://schema.org/MovieTheater"]').each(function(key, val) {
			var theater = $(val);
			console.log(theater.find('meta[itemprop="name"]').attr('content'));
		});
	}
});