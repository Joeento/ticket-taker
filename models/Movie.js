var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var movieSchema = new Schema({
    name: String,
    fandango_id: String,
    fandango_slug: String,
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
movieSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});
// the schema is useless so far
// we need to create a model using it
var Movie = mongoose.model('Movie', movieSchema);

// make this available to our Movies in our Node applications
module.exports = Movie;