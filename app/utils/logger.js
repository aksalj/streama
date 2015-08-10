/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : logger
 *  Date : 8/10/15 1:15 PM
 *  Description :
 *
 */
'use strict';
var FileStreamRotator = require('file-stream-rotator');
var fs = require("fs");
var morgan = require('morgan');


exports.setup = function (app, env) {
  if(env === "production"){

    var logDirectory = process.cwd() + '/log';
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    var accessLogStream = FileStreamRotator.getStream({
      filename: logDirectory + '/access-%DATE%.log',
      frequency: 'daily',
      verbose: false
    });

    app.use(morgan('combined', {stream: accessLogStream}));

  } else {
    app.use(morgan("dev"));
  }
};
