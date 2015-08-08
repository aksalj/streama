/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : User
 *  Date : 8/7/15 3:45 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');


var UserSchema = mongoose.Schema({
  dateCreated: {type: Date, required: false},
  lastUpdated: {type: Date, required: false},
  deleted: { type: Boolean, default: false },

  username: {type: String, unique: true, required: true},
  password: {type: String, required: true}, // TODO: Encrypt before insert

  enabled: { type: Boolean, default: false },
  accountExpired: Boolean,
  accountLocked: Boolean,
  passwordExpired: Boolean,
  invitationSent: { type: Boolean, default: false },

  uuid: String,
  fullName: String,

  favoriteGenres:[mongoose.Schema.Types.ObjectId], // TODO: static hasMany = [favoriteGenres: Genre]

  userRoles:[mongoose.Schema.Types.ObjectId]

});

UserSchema.pre('save', function(next) {
  this.dateCreated = new Date();
  if(!this.password) {
    this.password = "pwd"; // TODO: Random UUID?
  }

  // TODO: Encrypt password

  next();
});

UserSchema.pre('update', function() {
  // TODO: Password dirty? Encrypt!


  this.update({},{ $set: { lastUpdated: new Date() } });
});

UserSchema.methods.getAuthorities = function (cb) {
  var roles = this.userRoles;
  return this.model('Role').find({ _id: {$in: roles}}, cb);
};


module.exports = mongoose.model("User", UserSchema);
