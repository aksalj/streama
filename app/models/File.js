/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : File
 *  Date : 8/7/15 3:44 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');

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

// TODO: getImagePath() getSrc()

module.exports = mongoose.model("File", FileSchema);
