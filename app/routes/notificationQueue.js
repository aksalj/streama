/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : notificationQueue
 *  Date : 9/7/15 6:58 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var async = require("async");
var utils = require("../utils");
var uiService = require("../services/streama/ui");
var marshal = require('../services/streama/marshaller');

var Models = require("../models");
var UserModel = Models.User;
var NotificationQueueModel = Models.NotificationQueue;

var router = express.Router();

router.get('/index.json', function (req, res) {
  NotificationQueueModel.find({})
    .populate("movie tvShow")
    .exec(function (err, notifications) {
    if(err) {
      console.error(err);
      notifications = [];
    }
    marshal.sendJson(res, notifications);
  });
});

router.get('/addMovieToCurrentNotification.json', function (req, res) {
  var data = {
    movie: req.query.id
  };
  NotificationQueueModel.create(data, function (err, created){
    if(err) {
      console.error(err);
    }
    marshal.sendJson(res, created);
  });
});

router.get('/addTvShowToCurrentNotification.json', function (req, res) {
  var data = {
    tvShow: req.query.id,
    description: req.query.description
  };
  NotificationQueueModel.create(data, function (err, created){
    if(err) {
      console.error(err);
    }
    marshal.sendJson(res, created);
  });
});

router.get('/sendCurrentNotifcations.json', function (req, res) {

  var sendNotifs = function (user, notifs, cb) {

    uiService.renderNotificationsEmail(notifs, function (err, html) {
      if (!err) {

        var message = {
          subject: "New Content on Streama",
          html: html
        };

        utils.email.send(user.email, message, function (error, info) {
          if (error) {
            cb(error);
          } else {
            cb(null);
          }
        });

      } else {
        cb(err);
      }
    });

  };

  NotificationQueueModel.find({isCompleted: false})
    .populate("movie tvShow")
    .exec(function (err, notifications) {
      if(err || !notifications || (notifications && notifications.length == 0)) {
        console.error(err);
        return res.sendStatus(404);
      }

      UserModel.find({deleted: false, roles: {$nin: ["ROLE_ADMIN"]}}, function(err, users) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        var tasks = [];
        users.forEach(function (user) {
          tasks.push(function(cb) {
            sendNotifs(user, notifications, cb);
          });
        });
        async.series(tasks, function(err, results) {
          if (err) {
            console.error(err);
          }
          
          var saveTasks = [];
          notifications.forEach(function (notif) {
            saveTasks.push(function (cb) {
              notif.isCompleted = true;
              notif.save(function (err) {
                cb(err);
              });
            });
          });
          async.series(saveTasks, function (err) {
            if (err) {
              console.error(err);
            }
            res.sendStatus(200);
          });

        });
      });

    });
});

module.exports = router;
