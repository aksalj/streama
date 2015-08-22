/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : dash
 *  Date : 8/7/15 3:49 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var async = require('async');
var _ = require('lodash');

var TvShowModel = require("../models").TvShow;
var MovieModel = require("../models").Movie;

var marshal = require("../services/streama/marshaller");

var router = express.Router();


router.get('/searchMedia.json', function(req, res) {
  var query = req.query.query;

  var tasks = [

    function(cb) {
      MovieModel.find({_type: "Movie" }, function (err, movies) {
        if(err || !movies) {
          console.error(err);
          movies = [];
        }

        var tasks = [];
        movies.forEach(function (movie) {
          if(_.includes(movie.title.toLowerCase(), query.toLowerCase())){
            tasks.push(function (ccb) {
              marshal.makeVideoJson(req, movie, function (json) {
                ccb(null, json);
              }, true);
            });
          }
        });

        async.series(tasks, function (err, results) {
          cb(err, results);
        });

      });
    },

    function (cb) {
      TvShowModel.find({})
        .populate("episodes")
        .exec(function (err, shows) {
        if(err || !shows) {
          console.error(err);
          shows = [];
        }

        var result = [];
        shows.forEach(function (show) {
          if(_.includes(show.name.toLowerCase(), query.toLowerCase())){
            result.push(marshal.makeFullShowJson(show));
          }
        });
        cb(err, result);
      });
    }
  ];

  async.series(tasks, function(err, results) {
    var status = err ? 500 : 200;
    var data = {
      movies: results[0] || [],
      shows: results[1] || []
    };

    marshal.sendJson(res, data, status);

  });


});

module.exports = router;
