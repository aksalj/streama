/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : video
 *  Date : 8/7/15 3:40 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var async = require("async");

var TvShowModel = require("../models").TvShow;
var MovieModel = require("../models").Movie;

var marshal = require("../services/streama/marshaller");
var router = express.Router();


router.get('/', function(req, res) {
  res.sendStatus(500);
});

router.get('/dash.json', function (req, res) {
  // FIXME: Clean me up!!!!!
  var user = req.user;

  async.series([
    function(callback) {
      TvShowModel.findAllNotDeleted(callback);
    },
    function(callback) {
      MovieModel.find({}, callback);
    }
  ], function(err, results) {

    var tvShows = results[0];
    var allMovies = results[1];
    var continueWatching = user.viewingStatus;

    var movies = [];
    allMovies.forEach(function (movie) {
      if (movie.files && movie.files.length > 0) {
        for(var i = 0; i < continueWatching.length; i++) {
          if (movie._id != continueWatching[i].video._id) {
            movies.push(movie);
          }
        }
      }
    });

    var firstEpisodes = [];
    //var _episodeSchema = require('mongoose').model('Episode').schema;
    tvShows.forEach(function(tvShow) {
      var i = 0;
      for(i; i < continueWatching.length; i++) {
        var viewSt = continueWatching[i];
        if (viewSt.video._type == 'episode' && viewSt.video.show._id == tvShow._id) {
          return;
        }
      }

      // Find first episode in tvShow??
      var firstEpisode = null;
      for(i = 0; i < tvShow.episodes.length; i++) {
        var ep = tvShow.episodes[i];
        if(ep.files && ep.season_number != "0") {
          firstEpisode = ep;
          break;
        }
      }
      if(firstEpisode) {
        tvShow.episodes.forEach(function(ep) {
          if(ep.season_number == firstEpisode.season_number &&
            ep.episode_number < firstEpisode.episode_number && ep.files.length != 0) {
            firstEpisode = ep;
          } else if (ep.season_number < firstEpisode.season_number && ep.files.length != 0 &&
            ep.season_number != "0") {
            firstEpisode = ep;
          }
        });
      }

      if(firstEpisode && firstEpisode.files.length != 0) {
        firstEpisode = firstEpisode.toJSON();
        firstEpisode.id = firstEpisode._id;
        firstEpisodes.push(firstEpisode);
      }

    });

    var result = {
      firstEpisodes: firstEpisodes,
      movies: movies,
      continueWatching: marshal.makeFullViewingStatusJson(continueWatching)
    };

    marshal.sendJson(res, result);

  });


});

module.exports = router;
