/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : Video
 *  Date : 8/7/15 3:46 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');

var settingsService = require("../services/streama/settings");

var FileSchema = mongoose.Schema({
  dateCreated: Date,
  lastUpdated: Date,

  sha256Hex: String,
  name: String,
  extension: String,
  contentType: String,
  originalFilename: String,
  size: Number,

  quality: {type: String, enum:['360p', '480p', '720p', '1080p']}


});


FileSchema.methods.getPath = function (callback) {
  var that = this;
  settingsService.getUploadDir(function(err, dir) {
    callback(dir + "/" + that.name);
  });
};

FileSchema.methods.getSrc = function() {
  return settingsService.getBaseUrl() + "file/serve/" + this.name;
};

var File = mongoose.model("File", FileSchema);


var VideoSchema = mongoose.Schema({
  dateCreated: {type: Date, required: false},
  lastUpdated: {type: Date, required: false},

  overview: String,
  apiId: String,
  original_language: String,

  vote_average: Number,
  vote_count: Number,
  popularity: Number,

  imdb_id: String,

  files: [FileSchema]

}, {collection : 'videos', discriminatorKey : '_type' });

module.exports = mongoose.model("Video", VideoSchema);
