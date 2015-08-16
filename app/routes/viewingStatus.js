/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : viewingStatus
 *  Date : 8/7/15 3:41 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var marshal = require("../services/streama/marshaller");

var VideoModel = require("../models").Video;
var ViewingStatusModel = require("../models").ViewingStatus;

var router = express.Router();

router.get('/', function(req, res) {
  ViewingStatusModel
    .find({user: user._id})
    .populate(["user", "video", "tvShow"])
    .exec(function(err, statuses) {
      if(err) {
        console.error(err);
        statuses = [];
      }
      callback(err, statuses);
    });
});

router.get('/save.json', function(req, res) {
  var currentTime = req.query.currentTime;
  var runtime = req.query.runtime;
  var videoId = req.query.videoId;

  VideoModel.findOne({_id: videoId}, function (err, video) {
    if(!video || !currentTime) {
      res.sendStatus(406);

    } else {

      var data = {
        runtime: runtime,
        currentPlayTime: currentTime,
        user: req.user._id,
        video: video._id,
        tvShow: video._type == "Episode" ? video.show : null
      };

      var cb = function (err, status, created) {

        var ccb = function(err, st) {
          if (err) {
            console.error(err);
            res.sendStatus(406);
          } else {
            data.id = st._id;
            marshal.sendJson(res, data, 201);
          }
        };

        if (err) {
          ccb(err);
        } else {

          if(!created) {
            for(var k in data) {
              status[k] = data[k];
            }
            status.save(ccb);
          } else {
            ccb(null, status);
          }

        }
      };

      // Find Or Create
      ViewingStatusModel.findOne({video: data.video},
        function(err, found) {
          if (err) {
            cb(err, found, false);
          } else if(!found) {
            ViewingStatusModel.create(data, function (err, status){
              cb(err, status, true);
            });
          } else {
            cb(null, found, false);
          }
        });

    }

  });

});


router.delete("/delete.json", function(req, res) {
  var id = req.query.id;
  ViewingStatusModel.findOneAndRemove({_id: id}, function(err){
    res.sendStatus(500);
  });
});

module.exports = router;
