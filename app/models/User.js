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

  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},

  enabled: { type: Boolean, default: false },
  accountExpired: Boolean,
  accountLocked: Boolean,
  passwordExpired: Boolean,
  invitationSent: { type: Boolean, default: false },

  uuid: String,
  fullName: String,

  favoriteGenres:[{type: mongoose.Schema.ObjectId, ref: 'GenreSchema'}],

  roles:[String]

});

/**
 *
 * @param value
 */
var hashPassword = function (value) {
  var salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(value, salt);
};

/**
 *
 * @param password
 * @param hash
 */
var isValidPassword = function (password, hash) {
  return bcrypt.compareSync(password, hash);
};


UserSchema.pre('save', function(next) {
  this.dateCreated = new Date();
  this.lastUpdated = new Date();

  this.password = hashPassword(this.password);

  next();
});

UserSchema.pre('update', function() {
  this.update({},{ $set: { lastUpdated: new Date() } });
});

// Static methods

// HUH: Use me for checkAvailability() as well
UserSchema.statics.findByEmail = function(email, cb) {
  if(!email){
    return cb("Invalid email");
  }
  return this.findOne({email: email}, cb);
};

UserSchema.statics.findByUuid = function(uuid, cb) {
  if(!uuid){
    return cb("Invalid uuid");
  }
  return this.findOne({uuid: uuid}, cb);
};

// Instance methods

UserSchema.methods.getAuthorities = function (cb) {
  var roles = this.roles;
  return this.model('Role').find({ authority: {$in: roles}}, cb);
};

UserSchema.methods.validPassword = function (password) {
  return isValidPassword(password, this.password);
};

UserSchema.methods.changePassword = function (current, newPwd, cb) {
  if (isValidPassword(current, this.password)) {
    this.password = newPwd; // will hash in pre save
    this.save(cb);
  } else {
    cb("Invalid Password!");
  }
};


module.exports = mongoose.model("User", UserSchema);
