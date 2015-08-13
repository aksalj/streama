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
//var MovieModel = require("../models").Movie;
var VideoModel = require("../models").Movie;

var marshal = require("../services/streama/marshaller");
var settingsService = require("../services/streama/settings");
var uploadService = require("../services/streama/upload");

var router = express.Router();


router.get('/', function(req, res) {
  VideoModel.find({}, function(err, videos) {
    if(err){
      console.error(err);
      videos = [];
    }
    marshal.sendVideoJson(res, videos);
  });
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
      VideoModel.find({}, function(err, videos) {
        var result = [];
        videos.forEach(function(video) {
          video = video.toJSON();
          video.id = video._id;
          result.push(video);
        });
        callback(null, result);
      });
    }
  ], function(err, results) {

    var tvShows = results[0];
    var videos = results[1];
    var continueWatching = user.viewingStatus;

    var movies = [];
    videos.forEach(function (video) {
      if (video.files && video.files.length > 0) {
        if (continueWatching.length > 0) {
          for (var i = 0; i < continueWatching.length; i++) {
            if (video._id != continueWatching[i].video._id) {
              movies.push(video);
            }
          }
        } else {
          movies.push(video);
        }
      }
    });

    var firstEpisodes = [];
    //var _episodeSchema = require('mongoose').model('Episode').schema;
    tvShows.forEach(function(tvShow) {
      var i = 0;
      for(i; i < continueWatching.length; i++) {
        var viewSt = continueWatching[i];
        if (viewSt.video._type == 'Episode' && viewSt.video.show._id == tvShow._id) {
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
        firstEpisode.show = tvShow.toJSON();
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

router.get('/show.json', function (req, res) {
  var videoId = req.query.id;
  VideoModel.findOne({_id: videoId}, function (err, video) {
    if(err) { console.error(err); }

    if (video) {
      marshal.sendVideoJson(res, video);
    } else {
      res.sendStatus(404);
    }
  });
});


router.post("/uploadFile.json", uploadService.upload, function(req, res) {
  marshal.sendFileJson(res, req.uploadedFile);
});

module.exports = router;
