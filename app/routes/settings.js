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

});

router.post('/validateSettings.json', function (req, res) {

});

module.exports = router;
