'use strict';

var request = require('request');
var cheerio = require('cheerio');
var yargs = require('yargs');
var nodemailer = require('nodemailer');

var config = require('./config');

var transporter = nodemailer.createTransport('smtps://' + config.gmailUsername + '%40gmail.com:' + config.gmailPassword + '@smtp.gmail.com');
var argv = require('yargs').argv;

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
						if (movie.find($('meta[itemprop="startDate"]')).length > 1) {
							console.log(true);
							var mailOptions = {
								from: '"Eric Kudler" <joeento@gmail.com>',
								to: config.phoneNumber + '@vtext.com',
								subject: '',
								text: 'It\'s go time. \n' + url,
							};
							transporter.sendMail(mailOptions, function(error, info){
								if(error){
									return console.log(error);
								}
								//console.log('Message sent: ' + info.response);
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