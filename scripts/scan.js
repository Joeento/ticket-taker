'use strict';

var request = require('request');
var mongoose = require('mongoose');

var config = require('../config');
var client = require('twilio')(config.twilio.sid, config.twilio.token);

var Job = require('../models/Job');
var Movie = require('../models/Movie');
var Theater = require('../models/Theater');

mongoose.connect(config.mongo.url);

Job.find().populate('movie').populate('theater').exec({}, function(err, jobs) {
    jobs.forEach(function(job) {
        var date = new Date(job.time_start);
        var options = {
            url: 'https://www.fandango.com/napi/theaterMovieShowtimes/' + job.theater.fandango_id + '?startDate=' + toISODate(date) + '&isdesktop=true',
            headers: {
                'cookie': config.fandango.cookie,
                'referer': 'https://www.fandango.com/amc-dine-in-levittown-10-AABQM/theater-page?date=2018-02-24'
            }
        };
        (function(jobCopy) {
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    data.viewModel.movies.forEach(function(movie) {
                        if (movie.title === jobCopy.movie.name) {
                            movie.variants.forEach(function(variant) {
                                if ((!job.format && variant.format === 'Standard') || job.format === variant.format) {
                                    variant.amenityGroups[0].showtimes.forEach(function(showtime) {
                                        var startDate = new Date(jobCopy.time_start);
                                        var endDate = new Date(jobCopy.time_end);
                                        var ticketingDate = showtime.ticketingDate.replace('+', ' ');
                                        var showtimeDate = new Date(ticketingDate);
                                        if (startDate <= showtimeDate && showtimeDate <= endDate) {
                                            var theater_slug = toSlug(job.theater);
                                            var link = 'https://www.fandango.com/' + theater_slug + '/theater-page?date=' + toISODate(startDate)
                                            console.log(link)
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        })(job);
    });
});


function toISODate(date) {
    return date.getFullYear() + '-' +
        ('0'+ (date.getMonth()+1)).slice(-2) + '-' +
        ('0'+ date.getDate()).slice(-2);
}

function toSlug(result) {
    var slug = result.name;
    slug = slug.toLowerCase();
    slug = slug.replace(/[\s\(\)]/g, '-');
    slug = slug + '-' + result.fandango_id;
    return slug;
}
