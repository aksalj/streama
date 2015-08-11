/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : Movie
 *  Date : 8/7/15 3:45 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var VideoSchema = require("./Video").schema;

var TMDb = require('../services/theMovieDb');
var settingsService = require("../services/streama/settings");

var MovieSchema = VideoSchema.extend({
  title: String,
  release_date: String,
  backdrop_path: String,
  poster_path: String
});


MovieSchema.methods.getSimilarMovies = function (callback) {
  var that = this;
  settingsService.getTMDbAPIkey(function(err, key) {
    if(key) {
      var tmdb = new TMDb(key);
      tmdb.getSimilarMovies(that.apiId, callback);
    } else {
      callback(err);
    }
  });
};

MovieSchema.methods.getFullMovieMeta = function (callback) {
  var that = this;
  settingsService.getTMDbAPIkey(function(err, key) {
    if(key) {
      var tmdb = new TMDb(key);
      tmdb.getFullMovieMeta(that.apiId, callback);
    } else {
      callback(err);
    }
  });
};

module.exports = mongoose.model("Movie", MovieSchema);
