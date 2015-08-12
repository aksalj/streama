/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : theMovieDb
 *  Date : 8/10/15 4:42 PM
 *  Description : See http://docs.themoviedb.apiary.io/
 *
 */
'use strict';
var request = require("request");

var TMDb = function(apiKey, debug) {

  if(debug) {
    require('request-debug')(request);
  }

  var BASE_URL = "https://api.themoviedb.org/3";
  var options = {

    qs:{
      api_key: apiKey
    },

    headers: {
      'User-Agent': 'Streama'
    }
  };

  this.hasValidKey = function (callback) {
    var uri = BASE_URL + '/configuration';
    request(uri, options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        callback(null, true);

      } else {
        callback(err, false);
      }
    });
  };

  this.search = function(mediaType, query, callback) {
    var uri = BASE_URL + '/search/' + mediaType;
    uri += '?query=' + encodeURIComponent(query);
    request(uri, options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var data = JSON.parse(body);
        callback(null, data.results);
      } else {
        callback(err || body);
      }
    });
  };

  this.getSimilarMovies = function(movieId, callback) {
    var uri = BASE_URL + '/movie/' + movieId + '/similar';
    request(uri, options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var data = JSON.parse(body);
        callback(null, data);
      } else {
        callback(err);
      }
    });
  };

  this.getExternalLinks = function (showId, callback) {
    var uri = BASE_URL + '/tv/' + showId + '/external_ids';
    request(uri, options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var data = JSON.parse(body);
        callback(null, data);
      } else {
        callback(err);
      }
    });
  };

  var getGenres = function (mediaType, callback) {
    var uri = BASE_URL + '/genre/'+mediaType+'/list';
    request(uri, options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var genres = (JSON.parse(body)).genres;
        genres.forEach(function(genre){
          genre.apiId = genre.id;
          delete genre.id;
        });
        callback(null, genres);
      } else {
        callback(err);
      }
    });
  };

  this.getMovieGenres = function (callback) {
    getGenres("movie", callback);
  };

  this.getTvGenres = function(callback) {
    getGenres("tv", callback);
  };

  this.getFullMovieMeta = function(movieId, callback) {
    var uri = BASE_URL + '/movie/'+movieId+'/list';
    request(uri, options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var data = JSON.parse(body);
        callback(null, data);
      } else {
        callback(err);
      }
    });
  };

  this.getFullShowSeason = function (tvShowId, season, callback) {
    var uri = BASE_URL + '/tv/' + tvShowId + "/season/";
    uri += encodeURIComponent(season);
    request(uri, options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var data = JSON.parse(body);
        callback(null, data.episodes);
      } else {
        callback(err);
      }
    });
  };

};

exports = module.exports = TMDb;

