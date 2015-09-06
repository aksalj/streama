/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : notificationQueue
 *  Date : 9/7/15 6:58 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var marshal = require('../services/streama/marshaller');

var router = express.Router();

router.get('/index.json', function (req, res) {
  marshal.sendJson(res, {error: "Not implemented!"}, 500);
});

router.get('/addMovieToCurrentNotification.json', function (req, res) {
  marshal.sendJson(res, {error: "Not implemented!"}, 500);
});

router.get('/sendCurrentNotifcations.json', function (req, res) {
  marshal.sendJson(res, {error: "Not implemented!"}, 500);
});

module.exports = router;
