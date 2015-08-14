/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : theMovieDb
 *  Date : 8/7/15 3:42 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var async = require("async");
var TMDb = require("../services/theMovieDb");
var marshal = require("../services/streama/marshaller");
var settingsService = require("../services/streama/settings");

var TvShowModel = require("../models").TvShow;
var EpisodeModel = require("../models").Episode;

var router = express.Router();

// FIXME: Use config key by default. Use key from DB if available
var tmdb = new TMDb(settingsService.getTMDbAPIkey());
settingsService.getTMDbAPIkey(function (err, settings) {
  if (!err && settings && settings.value) {
    tmdb = new TMDb(settings.value);
  }
});


router.get('/search.json', function (req, res) {
  var type = req.query.type;
  var name = req.query.name;
  tmdb.search(type, name, function (err, data) {
    var status = 200;
    if (err || !data) {
      status = 404;
    }
    marshal.sendJson(res, data, status);
  });

});

router.get('/seasonForShow.json', function (req, res) {
  var apiId = req.query.apiId;
  var season = req.query.season;
  var showId = req.query.showId;
  tmdb.getFullShowSeason(apiId, season, function (err, episodes) {
    if (err) {
      console.error(err);
    }

    if (episodes) {

      TvShowModel
        .findOne({_id: showId})
        .populate("episodes")
        .exec(function (err, show) {
          if (err) {
            console.error(err);
            res.sendStatus(404);
            return;
          }


          var episodesAdded = [];
          var episodesToExclude = [];
          show.episodes.forEach(function (savedEpisode) {
            episodesToExclude.push(savedEpisode.season_number + ":" + savedEpisode.episode_number);
          });


          var tasks = [];
          episodes.forEach(function (episode) {
            tasks.push(function (callback) {
              var epIdx = episode.season_number + ":" + episode.episode_number;
              if (episodesToExclude.indexOf(epIdx) == -1) {
                episode.show = showId;
                var ep = new EpisodeModel(episode);
                ep.save(function (err, savedEp) {
                  if (err) {
                    console.error(err);
                  }
                  show.episodes.push(savedEp._id);
                  show.save(function (err) {
                    episode.id = savedEp._id;
                    episodesAdded.push(episode);
                    callback();
                  });
                });

              } else {
                callback();
              }
            });
          });

          async.series(tasks, function () {
            show.save(function (err) {
              if (err) {
                console.error(err);
              }
              marshal.sendJson(res, episodesAdded);
            });
          });

        });

    } else {
      marshal.sendJson(res, []);
    }

  });
});

router.get('/availableGenres.json', function (req, res) {
  var tasks = [
    tmdb.getMovieGenres,
    tmdb.getTvGenres
  ];

  async.series(tasks, function (err, results) {
    if (err) {
      console.error(err);
    }
    var allGenres = results[0].concat(results[1]); // TODO: merge results from all tasks
    marshal.sendJson(res, allGenres);
  });

});


module.exports = router;
