/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : Settings
 *  Date : 8/7/15 3:45 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');


var SettingsSchema = mongoose.Schema({
  settingsKey: {type: String, required: true},
  value: String,
  description: String,
  required: Boolean
});

SettingsSchema.statics.findBySettingsKey = function (key, cb) {
  this.findOne({settingsKey:key}, cb);
};

module.exports = mongoose.model("Settings", SettingsSchema);
