/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : fsUtils
 *  Date : 8/10/15 11:36 AM
 *  Description :
 *
 */
'use strict';
var fs = require("fs");

/**
 * Check a file permission.
 * See http://stackoverflow.com/questions/11775884/nodejs-file-permissions
 * @param file
 * @param mask
 * @param cb
 */
var checkPermission = function (file, mask, cb){
  fs.stat (file, function (error, stats){
    if (error){
      cb (error, false);
    }else{
      cb (null, !!(mask & parseInt ((stats.mode & parseInt ("777", 8)).toString (8)[0])));
    }
  });
};


exports.canExecute = function (file, cb){
  checkPermission (file, 1, cb);
};

exports.canRead = function (file, cb){
  checkPermission (file, 4, cb);
};

exports.canWrite = function (file, cb){
  checkPermission (file, 2, cb);
};
