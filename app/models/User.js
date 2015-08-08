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
var bcrypt = require('bcrypt');


var UserSchema = mongoose.Schema({
  dateCreated: {type: Date, required: false},
  lastUpdated: {type: Date, required: false},
  deleted: { type: Boolean, default: false },

  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},

  enabled: { type: Boolean, default: false },
  accountExpired: Boolean,
  accountLocked: Boolean,
  passwordExpired: Boolean,
  invitationSent: { type: Boolean, default: false },

  uuid: String,
  fullName: String,

  favoriteGenres:[mongoose.Schema.Types.ObjectId], // TODO: static hasMany = [favoriteGenres: Genre]

  roles:[mongoose.Schema.Types.ObjectId]

});

var hashPassword = function (value) {
  var salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(value, salt);
};

var validPassword = function (password, hash) {
  return bcrypt.compareSync(password, hash);
};

UserSchema.pre('save', function(next) {
  this.dateCreated = new Date();
  this.lastUpdated = new Date();

  this.password = hashPassword(this.password);

  next();
});

UserSchema.pre('update', function() {
  // TODO: Password dirty? Encrypt!


  this.update({},{ $set: { lastUpdated: new Date() } });
});

// Static methods

// HUH: Use me for checkAvailability() as well
UserSchema.statics.findByUsername = function(usrname, cb) {
  return this.model('User').find({username: usrname}, cb);
};


// Instance methods

UserSchema.methods.getAuthorities = function (cb) {
  var roles = this.roles;
  return this.model('Role').find({ _id: {$in: roles}}, cb);
};

UserSchema.methods.checkPassword = function (password) {
  return validPassword(password, this.password);
};

UserSchema.methods.changePassword = function (current, password) {

};


module.exports = mongoose.model("User", UserSchema);
