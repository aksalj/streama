/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : index.js
 *  Date : 8/7/15 3:43 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');

// TODO: Load DB config
mongoose.connect('mongodb://localhost:27017/stream');


exports.User = require("./User");
exports.Role = require("./Role");
exports.Settings = require("./Settings");
exports.File = require("./File");
exports.Genre = require("./Genre");
exports.Episode = require("./Episode");
exports.TvShow = require("./TvShow");
exports.Movie = require("./Movie");
exports.Video = require("./Video");
exports.ViewingStatus = require("./ViewingStatus");



