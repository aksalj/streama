/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : settings
 *  Date : 8/7/15 3:42 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var async = require("async");
var SettingsModel = require('./../models/Settings');
var marshal = require("./../services/streama/marshaller");
var settingsService = require("./../services/streama/settings");

var router = express.Router();

/**
 * Return all settings
 * Should be /settings.json and not /settings
 */
router.get('/', function (req, res) {
  SettingsModel.find({}, function (err, settings) {
    if (!err && settings) {
      marshal.sendJson(res, settings);
    } else {
      res.sendStatus(500);
    }
  });
});

router.post('/updateMultiple.json', function (req, res) {
  var data = req.body;
  var tasks = [];
  data.forEach(function(item) {
    if(item.dirty && item.valid) {
      tasks.push(function(callback){
        SettingsModel.update({_id: item._id}, {value: item.value}, function(err) {
          if(err){
            console.error(err);
          }
          callback(err);
        });
      });
    }
  });

  async.series(tasks, function() {
    res.end();
  });

});

router.post('/validateSettings.json', function (req, res) {
  settingsService.validateSettings(req.body, function(success, msg) {
    var data = {
      success: success,
      message: msg
    };
    if (success) {
      marshal.sendJson(res, data);
    } else {
      marshal.sendJson(res, data, 400);
    }
  });
});

module.exports = router;
