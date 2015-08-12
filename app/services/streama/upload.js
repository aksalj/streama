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
var conf = require("config");
var path = require("path");
var multer  = require('multer');
var SHA256 = require("crypto-js/sha256");

var settingsService = require("./settings");
var utils = require("../../utils/index");
var VideoModel = require("../../models").Video;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    settingsService.getUploadDir(function (err, dir) {
      if(err) { console.error(err); }
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    var name = SHA256(file.originalname + '-' + Date.now());
    cb(null, name + path.extname(file.originalname));
  }
});

exports.upload = [

  // First, Make sure video for which file is being uploaded exists
  function(req, res, next) {

    var videoId = req.query.id;
    VideoModel.findOne({_id: videoId}, function (err, video) {
      if(err) { console.error(err);}

      if(video) {
        //console.error(video);
        next();
      } else {
        res.sendStatus(404);
      }
    });
  },

  multer({ storage: storage }).single("file"),

  function(req, res, next) {
    var videoId = req.query.id;
    if (req.file) {
      // Add file to video
      VideoModel.findOne({_id: videoId}, function (err, video) {
        if(!err && video) {

          var uploaded = req.file;
          var fileData = {
            name: uploaded.filename,
            sha256Hex: path.basename(uploaded.filename,path.extname(uploaded.originalname)),
            originalFilename: uploaded.originalname,
            contentType: uploaded.mimetype,
            extension: path.extname(uploaded.originalname),
            size: uploaded.size
          };
          var File = mongoose.model('File');
          var file = new File(fileData);
          video.files.push(file);
          video.save(function(err) {
            if(err) { console.error(err); }
            req.uploadedFile = file;
            next();
          });
        } else {
          res.sendStatus(500);
        }
      });
    } else {
      res.sendStatus(401);
    }
  }

];



