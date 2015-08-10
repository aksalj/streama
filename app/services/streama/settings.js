/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : settings
 *  Date : 8/8/15 2:32 PM
 *  Description :
 *
 */
'use strict';
var conf = require("config");
var fse = require("fs-extra");
var utils = require("../../utils/index");
var TMDb = require("../theMovieDb");

var SettingsModel = require("../../models").Settings;


var protocol = conf.get("app.secure") ? "https://" : "http://";
var port = conf.get("app.secure") ? conf.get("app.ssl.port") : conf.get("app.port");
var BASE_URL = protocol + conf.get("app.host") + ":" + port + "/";

var TMDb_API_KEY = conf.get("apiKeys.tmdb");

var KEY_BASE_URL = "Base URL";
var KEY_UPLOAD_DIRECTORY = "Upload Directory";
var KEY_TMDb_API_KEY = "TheMovieDB API key";

var DEFAULT_SETTINGS = [
  {
    settingsKey: KEY_UPLOAD_DIRECTORY,
    description: 'This setting provides the application with your desired upload-path for all files. ' +
    'The default so far has been /data/streama. Remember: if you change this path, copy all the files ' +
    '(that were previously added) into the new directory.',
    required: true
  },

  {
    settingsKey: KEY_TMDb_API_KEY,
    value: TMDb_API_KEY,
    description: 'This API-key is required by the application to fetch all the nice Movie/Episode/Show data for you. ' +
    'Get one for free at https://www.themoviedb.org/',
    required: true
  },

  {
    settingsKey: KEY_BASE_URL,
    value: BASE_URL,
    description: 'The Base-URL is used for the videos and the link in the invitation-email.',
    required: true
  }

];

var validateDirectoryPermissions = function (uploadDir, cb) {

  fse.mkdirp(uploadDir, function (err) {
    var msg = "The directory could not be accessed by the application. Please make sure that the directory exists and " +
      "that you set the correct permissions.";
    if(err){
      console.error(err);
      cb(false, msg);
    } else {
      utils.fs.canWrite(uploadDir, function(err, yes) {
        if(err){ console.error(err); }

        var success = yes == true;
        if(success) {
          msg = "The directory was successfully accessed by the application";
        }

        cb(success, msg);
      });
    }
  });

};

var validateTMDbAPIKey = function (apiKey, cb) {
  var tmdb = new TMDb(apiKey, true);
  tmdb.hasValidKey(function(err, valid) {
    var msg = "Invalid API key: You must have granted a valid key.";
    if (valid) {
      msg = "The API-Key is valid and can be used!";
    }
    cb(valid, msg);
  });
};


exports.getDefaultSettings = function () {
  return DEFAULT_SETTINGS;
};

exports.getBaseUrl = function () {
  return BASE_URL;
};

exports.getTMDbAPIkey = function (callback) {
  if(typeof callback == "function") { // Read Key from DB
    SettingsModel.findBySettingsKey(KEY_TMDb_API_KEY, callback);
  } else { // Key from config file
    return TMDb_API_KEY;
  }
};


/**
 *
 * @param settings
 * @param callback
 */
exports.validateSettings = function (settings, callback) {
  if(settings.settingsKey === KEY_UPLOAD_DIRECTORY) {
    validateDirectoryPermissions(settings.value, callback);
  } else if (settings.settingsKey === KEY_TMDb_API_KEY) {
    validateTMDbAPIKey(settings.value, callback);
  }
};
