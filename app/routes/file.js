/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : file
 *  Date : 8/7/15 3:49 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var settingsService = require("../services/streama/settings");

var uploadDir = settingsService.getUploadDir();
settingsService.getUploadDir(function(er, dir) {
  if(dir){ uploadDir = dir; }
});

var router = express.Router();


router.get('/', function(req, res) {
  res.sendStatus(500);
});

router.get('/serve/:file', function(req, res) {
  res.download(uploadDir + "/" + req.params.file);
});

module.exports = router;
