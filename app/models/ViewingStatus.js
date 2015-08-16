/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : ViewingStatus
 *  Date : 8/16/15 7:33 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require("mongoose");


var ViewingStatusSchema = mongoose.Schema({
  dateCreated: {type: Date, required: false},
  lastUpdated: {type: Date, required: false},

  currentPlayTime: {type:Number, required: true},
  runtime: Number,
  completed: {type:Boolean, default: false},

  user:{type: mongoose.Schema.ObjectId, ref: "User"},
  tvShow:{type: mongoose.Schema.ObjectId, ref: "TvShow"},
  video:{type: mongoose.Schema.ObjectId, ref: "Video", required: true}

});

module.exports = mongoose.model("ViewingStatus", ViewingStatusSchema);
