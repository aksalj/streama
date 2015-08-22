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
var EpisodeModel = require("../models").Episode;
var VideoModel = require("../models").Video;
var ViewingStatusModel = require("../models").ViewingStatus;

var marshal = require("../services/streama/marshaller");
var settingsService = require("../services/streama/settings");
var uploadService = require("../services/streama/upload");
var mediaService = require("../services/streama/media");

var router = express.Router();


router.get('/', function (req, res) {
  VideoModel.find({}, function (err, videos) {
    if (err) {
      console.error(err);
      videos = [];
    }
    marshal.sendVideoJson(req, res, videos);
  });
  res.sendStatus(500);
});

router.get('/dash.json', function (req, res) {
  // FIXME: Clean me up!!!!!
  var user = req.user;

  async.series([
    function (callback) {
      TvShowModel.findAllNotDeleted(callback);
    },

    function (callback) {
      VideoModel.find({}, function (err, videos) {
        var result = [];
        videos.forEach(function (video) {
          video = video.toJSON();
          video.id = video._id;
          result.push(video);
        });
        callback(null, result);
      });
    },

    function(callback) {
      ViewingStatusModel
        .find({user: user._id})
        .populate("video")
        .exec(function(err, statuses) {
          if(err) {
            console.error(err);
            statuses = [];
          }

          var tasks = [];
          statuses.forEach(function (item) {

            var status = item.toJSON();
            status.video.id = status.video._id;

            if (status.video._type == "Episode") {
              tasks.push(function (callback) {
                EpisodeModel.findOne({_id: status.video._id})
                  .populate("show", "name")
                  .exec(function (err, video) {
                    status.video = video.toJSON();
                    status.video.id = video._id;
                    callback(err, status);
                  });
              });
            } else {
              tasks.push(function (callback) {
                callback(null, status);
              });
            }

          });

          async.series(tasks, callback);

        });
    }

  ], function (err, results) {

    var tvShows = results[0];
    var videos = results[1];
    var continueWatching = results[2];

    var movies = [];
    videos.forEach(function (video) {
      if (video._type == "Movie" && video.files && video.files.length > 0) {
        movies.push(video);
      }
    });

    var firstEpisodes = [];
    //var _episodeSchema = require('mongoose').model('Episode').schema;
    tvShows.forEach(function (tvShow) {
      var i = 0;
      for (i; i < continueWatching.length; i++) {
        var viewSt = continueWatching[i];
        if (viewSt.video._type == 'Episode' && viewSt.video.show._id == tvShow._id) {
          return;
        }
      }

      // Find first episode in tvShow??
      var firstEpisode = mediaService.getFirstEpisode(tvShow);

      if (firstEpisode) {
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
  VideoModel
    .findOneWithPopulate({_id: videoId}, function (err, video) {
      if (err) {
        console.error(err);
      }

      if (video) {
        marshal.sendVideoJson(req, res, video);
      } else {
        res.sendStatus(404);
      }
    });
});


router.post("/uploadFile.json", uploadService.upload, function (req, res) {
  marshal.sendFileJson(res, req.uploadedFile);
});

module.exports = router;
