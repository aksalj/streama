/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : episode
 *  Date : 8/7/15 3:40 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');

var TvShowModel = require("../models").TvShow;
var marshal = require("../services/streama/marshaller");
var router = express.Router();


router.get('/', function(req, res) {
  var id = req.query.showId;
  TvShowModel.findOne({_id: id}, function (err, show) {
    var episodes = [];
    if(show) {
      episodes = show.episodes;
    }
    marshal.sendJson(res, episodes);
  });
});

module.exports = router;
