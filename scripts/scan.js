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
                            console.log(movie);
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
