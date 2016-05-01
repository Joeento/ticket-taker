'use strict';

var request = require('request');
var cheerio = require('cheerio');
var yargs = require('yargs');
var nodemailer = require('nodemailer');

var config = require('./config');

var transporter = nodemailer.createTransport('smtps://' + config.gmailUsername + '%40gmail.com:' + config.gmailPassword + '@smtp.gmail.com');
var argv = require('yargs').argv;
request('http://www.fandango.com/captainamerica:civilwar_185792/movietimes?location=' + argv.zip + '&date=' + argv.date, function (error, response, html) {
	if (!error && response.statusCode === 200) {
		var $ = cheerio.load(html);
		$('div[itemtype="http://schema.org/MovieTheater"]').each(function(key, val) {
			var theater = $(val);
			var theaterName = theater.find('meta[itemprop="name"]').attr('content');
			if (theaterName === argv.theater) {
				theater.find($('span[itemtype="http://schema.org/TheaterEvent"]')).each(function(key, val) {
					var movie = $(val);
					var movieName = movie.find('meta[itemprop="name"]').attr('content');
					console.log(movieName);
					movie.find($('meta[itemprop="startDate"]')).each(function(key, val) {
						var showtime = $(val);
						console.log(showtime.attr('content'));
					});

					var mailOptions = {
						from: '"Eric Kudler" <joeento@gmail.com>',
						to: config.phoneNumber + '@vtext.com',
						subject: '',
						text: 'Hello world',
					};
					transporter.sendMail(mailOptions, function(error, info){
						if(error){
							return console.log(error);
						}
						console.log('Message sent: ' + info.response);
					});

				});
				return false;
			}
		});
	}
});