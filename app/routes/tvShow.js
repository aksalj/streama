/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : tvShow
 *  Date : 8/7/15 3:39 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var uuid = require('uuid');

var utils = require("../utils");
var marshal = require('../services/streama/marshaller');
var TvShowModel = require("../models").TvShow;

var router = express.Router();

/**
 * List tv shows
 */
router.get('/', function (req, res) {
  TvShowModel.findAllNotDeleted(function(err, shows) {
    if(err) {
      console.error(err);
    }
    var data = [];
    if (shows) {
      data = marshal.makeFullShowJson(shows);
    }
    marshal.sendJson(res, data);
  });

});

router.get('/show.json', function (req, res) {
  var id = req.query.id;
  TvShowModel.findOne({_id:id}, function (err, show) {
    if (err){
      console.error(err);
      res.sendStatus(500);
    } else {
      marshal.sendJson(res, marshal.makeFullShowJson(show));
    }
  });
});

router.post('/save.json', function (req, res) {
  var showData = req.body;

  // Find or create
  var id = showData._id || null;
  TvShowModel.findOne({_id: id}, function (err, found) {
    if(err) {
      console.error(err);
    }

    var cb = function (show) {
      for(var k in showData) {
        show[k] = showData[k];
      }

      var saveAndRespond = function () {
        show.save(function (err, show) {
          if (err) {
            console.error(err);
          }
          marshal.sendJson(res, show);
        });
      };

      // TODO: Find imdb id
      if(!show.imdb_id) {
        show.getExternalLinks(function(err, data) {
          if(data) {
            show.imdb_id = data.imdb_id;
          }
          saveAndRespond();
        });
      } else {
        saveAndRespond();
      }

    };

    if (!found){
      TvShowModel.create(showData, function (err, show) {
        if(err) {
          console.error(err);
        } else if (show) {
          return cb(show);
        }
        res.sendStatus(500);
      });
    } else {
      cb(found);
    }
  });



});

router.delete('/delete.json', function (req, res) {
  var id = req.query.id;
  TvShowModel.findOneAndRemove(id, function(err) {
    res.sendStatus(200);
  });

});

router.get('/episodesForTvShow.json', function (req, res) {
  res.sendStatus(500);
});

module.exports = router;
