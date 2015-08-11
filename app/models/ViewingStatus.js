/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : ViewingStatus
 *  Date : 8/7/15 3:46 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');


var ViewingStatusSchema = mongoose.Schema({
  dateCreated: {type: Date, required: false},
  lastUpdated: {type: Date, required: false},

  user: {type: Schema.ObjectId, ref: 'UserSchema'},
  video: {type: Schema.ObjectId, ref: 'VideoSchema', required: true},
  tvShow: {type: Schema.ObjectId, ref: 'TvShowSchema'},

  currentPlayTime: {type: Number, required: true},
  runtime: Number,
  completed: Boolean

});

ViewingStatusSchema.statics.findAllByUser = function (user, callback) {
  this.find({user: user._id}, callback);
};


module.exports = mongoose.model("ViewingStatus", ViewingStatusSchema);
