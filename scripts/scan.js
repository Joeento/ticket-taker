'use strict';

var request = require('request');
var config = require('../config');
var client = require('twilio')(config.twilio.sid, config.twilio.token);
var mongoose = require('mongoose');

var Job = require('../models/Job.js');

mongoose.connect(config.mongo.url);

Job.find({}, function(err, jobs) {
  console.log(job);
  jobs.forEach(function() {
    console.log('yes');
  });
  mongoose.connection.close()
});
