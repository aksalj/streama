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
var SettingsModel = require('./../models/Settings');
var marshal = require("./../services/marshaller");
var settingsService = require("./../services/settings");

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
  console.error(req.body);
  res.end();
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
