/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : Episode
 *  Date : 8/7/15 3:44 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var VideoSchema = require("./Video").schema;

String.prototype.padLeft = function(l,c) {
  return new Array(l-this.length+1).join(c||" ")+this;
};

var EpisodeSchema = VideoSchema.extend({
  name: String,
  air_date: String,
  season_number: Number,
  episode_number: Number,
  episodeString: String,

  still_path: String,

  show: {type: mongoose.Schema.ObjectId, ref: "TvShowSchema"}

});

EpisodeSchema.pre('update', function() {
  this.episodeString = "s" + this.season_number.toString().padLeft(2, '0');
  this.episodeString += +"e" + this.episode_number.toString().padLeft(2, '0');
});


EpisodeSchema.statics.findAllByShow = function(showId, callback) {
  this.find({show: showId}, callback);
};

module.exports = mongoose.model("Episode", EpisodeSchema);
