/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : TvShow
 *  Date : 8/7/15 3:45 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');
var TMDb = require('../services/theMovieDb');
var settingsService = require("../services/streama/settings");

var TvShowSchema = mongoose.Schema({
  dateCreated: {type: Date, required: false},
  lastUpdated: {type: Date, required: false},
  deleted: { type: Boolean, default: false },

  name: {type: String, required: true},
  overview: String, // TODO: Limit size to 5k characters?
  apiId: String,

  backdrop_path: String,
  poster_path: String,
  first_air_date: String,
  original_language: String,
  imdb_id: String,

  vote_average: Number,
  vote_count: Number,
  popularity: Number,

  //episodes:[{type: mongoose.Schema.ObjectId, ref: 'EpisodeSchema'}]
  episodes:[mongoose.model('Episode').schema]

});

TvShowSchema.statics.findAllNotDeleted = function(callback) {
  this.find({deleted: false}, callback);
};

TvShowSchema.methods.getExternalLinks = function(callback) {
  var that = this;
  settingsService.getTMDbAPIkey(function(err, key) {
    if(key) {
      var tmdb = new TMDb(key);
      tmdb.getExternalLinks(that.apiId, callback);
    } else {
      callback(err);
    }
  });
};


module.exports = mongoose.model("TvShow", TvShowSchema);
