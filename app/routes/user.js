/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : user
 *  Date : 8/7/15 3:39 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');

var authService = require('../services/auth');
var marshalService = require('../services/streama/marshaller');
var UserModel = require("../models").User;

var router = express.Router();

//router.use(function (req, res, next) {
//  console.log('User Access: ', Date.now());
//  next();
//});

/**
 * List users? should be /user.json and not /user
 */
router.get('/', function(req, res) {
  res.end();
});

/**
 * Current User
 */
router.get('/current.json', function(req, res) {
  marshalService.sendUserJson(res, req.user);
});

/**
 * Save User
 */
router.post('/save.json', function(req, res) {
  res.end();
});


/**
 * Check Availability?
 */
router.get('/checkAvailability.json', function(req, res) {
  res.end();
});

/**
 * Save and invite
 */
router.post('/saveAndInviteUser.json', function(req, res) {
  res.end();
});


/**
 * Save Profile
 */
router.post('/saveProfile.json', function(req, res) {
  var userData = req.body;
  var id = userData.id;
  delete userData.id;
  UserModel.findOneAndUpdate({_id: id}, userData, function(err) {
    if(err){
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

/**
 * Available roles
 */
router.get('/availableRoles.json', function(req, res) {
  res.end();
});


/**
 * Change password
 */
router.post('/changePassword.json', function(req, res) {
  var old = req.body.oldPassword;
  var newPwd = req.body.newPassword;
  var newRepeatPwd = req.body.repeatPassword;
  if (newPwd !== newRepeatPwd) {
    marshalService.sendJson(res, {message: "Passwords do not match"}, 400);
    return;
  }

  var user = req.user;
  user.changePassword(old, newPwd, function(err) {
    if(err){
      console.error(err);
      var msg = (typeof err == "string") ? err : "Check your password!";
      marshalService.sendJson(res, {message: msg}, 400);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
