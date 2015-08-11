/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : tvShow
 *  Date : 8/7/15 3:39 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var uuid = require('uuid');

var utils = require("../utils");
var marshal = require('../services/streama/marshaller');

var router = express.Router();

/**
 * List tv shows
 */
router.get('/', function (req, res) {
  res.sendStatus(500);
});

router.get('/show.json', function (req, res) {
  res.sendStatus(500);
});

router.post('/save.json', function (req, res) {
  res.sendStatus(500);
});

router.delete('/delete.json', function (req, res) {
  res.sendStatus(500);
});

router.get('/episodesForTvShow.json', function (req, res) {
  res.sendStatus(500);
});

module.exports = router;
