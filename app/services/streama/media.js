/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : upload
 *  Date : 8/12/15 5:16 PM
 *  Description :
 *
 */
'use strict';
var mongoose = require('mongoose');

var TvShowModel = require("../../models").TvShow;
var VideoModel = require("../../models").Video;
var EpisodeModel = require("../../models").Episode;
var MovieModel = require("../../models").Movie;


exports.getFirstEpisode = function (tvShow) {
  // TODO: Check that type of tvShow is TvShow model

  if(!tvShow) { return null; }

  var firstEpisode = null;

  for (var i = 0; i < tvShow.episodes.length; i++) {
    var ep = tvShow.episodes[i];
    if (ep.files && ep.season_number != "0") {
      firstEpisode = ep;
      break;
    }
  }

  if (firstEpisode) {
    tvShow.episodes.forEach(function (ep) {
      if (ep.season_number == firstEpisode.season_number &&
        ep.episode_number < firstEpisode.episode_number && ep.files.length != 0) {
        firstEpisode = ep;
      } else if (ep.season_number < firstEpisode.season_number && ep.files.length != 0 &&
        ep.season_number != "0") {
        firstEpisode = ep;
      }
    });

    if(firstEpisode.files.length != 0) {
      firstEpisode = firstEpisode.toJSON();
      firstEpisode.id = firstEpisode._id;
      firstEpisode.show = tvShow.toJSON();
      firstEpisode.show.id = tvShow._id;
    } else { // TV Show's first episode has no files.
      firstEpisode = null;
    }
  }

  return firstEpisode;

};



