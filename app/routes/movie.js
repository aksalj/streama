/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : movie
 *  Date : 8/7/15 3:41 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var marshal = require('../services/streama/marshaller');
var MovieModel = require("../models").Movie;

var router = express.Router();


router.get('/', function(req, res) {
  MovieModel.find({}, function(err, movies) {
    if(err) {
      console.error(err);
      movies = [];
    }
    marshal.sendJson(res, movies);
  });
});

router.get("/show.json", function(req, res) {
  var id = req.query.id;
  MovieModel.findOne({_id: id}, function(err, movie) {
    if(err){
      console.error(err);
      res.sendStatus(404);
    } else {
      marshal.sendMovieJson(res, movie);
    }
  })
});

router.post("/save.json", function(req, res) {
  var data = req.body;

  // Find or create
  var id = data._id || null;
  MovieModel.findOne({_id: id}, function (err, found) {
    if (err) {
      console.error(err);
    }

    var cb = function (movie) {
      for (var k in data) {
        movie[k] = data[k];
      }

      var saveAndRespond = function () {
        movie.save(function (err, movie) {
          if (err) {
            console.error(err);
          }
          marshal.sendJson(res, movie);
        });
      };

      // TODO: Find imdb id
      if (!movie.imdb_id) {
        movie.getFullMovieMeta(function (err, data) {
          if (data) {
            movie.imdb_id = data.imdb_id;
          }
          saveAndRespond();
        });
      } else {
        saveAndRespond();
      }

    };

    if (!found) {
      MovieModel.create(data, function (err, movie) {
        if (err) {
          console.error(err);
        } else if (movie) {
          return cb(movie);
        }
        res.sendStatus(500);
      });
    } else {
      cb(found);
    }

  });

});

module.exports = router;
