/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : index
 *  Date : 8/10/15 11:35 AM
 *  Description :
 *
 */
'use strict';
var conf = require("config");

exports.HttpServer = require("./httpServer");
exports.logger = require("./logger");
exports.fs = require("./fsUtils");
exports.email = require("./email");

exports.isProduction = function () {
  return conf.util.getEnv('NODE_ENV') === "production";
};

exports.isDevelopment = function () {
  return conf.util.getEnv('NODE_ENV') === "development";
};
