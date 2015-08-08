/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : auth
 *  Date : 8/8/15 4:08 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var UserModel = require("../models").User;

var router = express.Router();



router.post('/login', function(req, res) {
  res.send('Authenticate');
});


router.get('/logout', function(req, res) {
  res.send('logout');
});

module.exports = router;

