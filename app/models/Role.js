/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : Role
 *  Date : 8/7/15 3:45 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');


var RoleSchema = mongoose.Schema({
  authority: {type: String, required: true, unique: true},
  displayName: String
});

module.exports = mongoose.model("Role", RoleSchema);
