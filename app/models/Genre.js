/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : Genre
 *  Date : 8/7/15 3:44 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');

var GenreSchema = mongoose.Schema({
  name: {type: String, required: true},
  apiId: {type: String, required: true}
});


module.exports = mongoose.model("Genre", GenreSchema);
