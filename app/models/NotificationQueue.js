/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : NotificationQueue
 *  Date : 9/7/15 7:07 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require("mongoose");


var NotificationQueueSchema = mongoose.Schema({
  dateCreated: {type: Date, required: false, default: Date.now},
  lastUpdated: {type: Date, required: false},

  isCompleted: {type:Boolean, default: false},

  tvShow:{type: mongoose.Schema.ObjectId, ref: "TvShow"},
  movie:{type: mongoose.Schema.ObjectId, ref: "Movie"},

  description: String

});

module.exports = mongoose.model("NotificationQueue", NotificationQueueSchema);
