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
var UserModel = require("../models").User;

var router = express.Router();

router.use(function (req, res, next) {
  console.log('User Access: ', Date.now());
  next();
});

/**
 * Current User
 */
router.get('/current.json', function(req, res) {
  res.send('Current user??');
});

/**
 * Save User
 */
router.post('/save.json', function(req, res) {
  res.send('OK');
});


/**
 * List users? should be /user.json and not /user
 */
router.get('/', function(req, res) {
  res.send('OK');
});

/**
 * Check Availability?
 */
router.get('/checkAvailability.json', function(req, res) {
  res.send('OK');
});

/**
 * Save and invite
 */
router.post('/saveAndInviteUser.json', function(req, res) {
  res.send('Current user??');
});


/**
 * Save Profile
 */
router.post('/saveProfile.json', function(req, res) {
  res.send('OK');
});

/**
 * Available roles
 */
router.get('/availableRoles.json', function(req, res) {
  res.send('OK');
});


/**
 * Change password
 */
router.post('/changePassword.json', function(req, res) {
  res.send('OK');
});

module.exports = router;
