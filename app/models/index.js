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
var conf = require("config");
var mongoose = require('mongoose');

exports.Role = require("./Role");
exports.Settings = require("./Settings");
exports.Video = require("./Video");
exports.Movie = require("./Movie");
exports.Episode = require("./Episode");
exports.TvShow = require("./TvShow");
exports.ViewingStatus = require("./ViewingStatus");
exports.NotificationQueue = require("./NotificationQueue");
exports.User = require("./User");


exports.connect = function (callback) {
  var uri = "mongodb://" + conf.get("database.host") + ":" + conf.get("database.port");
  uri += "/" + conf.get("database.name");

  var options = {
    user:conf.get("database.user"),
    pass:conf.get("database.password"),
    server:{},
    replset:{}
  };

  if(conf.get("database.keepAlive")) {
    options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };
  }

  mongoose.connect(uri, options, callback);
};
