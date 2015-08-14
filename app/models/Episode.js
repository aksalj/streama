/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : Episode
 *  Date : 8/13/15 5:33 PM
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

  show: {type: mongoose.Schema.ObjectId, ref: "TvShow"}

});

EpisodeSchema.pre('save', function(next) {
  this.episodeString = "S" + this.season_number.toString().padLeft(2, '0');
  this.episodeString += "E" + this.episode_number.toString().padLeft(2, '0');
  next();
});


module.exports = mongoose.model("Episode", EpisodeSchema);

