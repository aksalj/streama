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
var uiService = require('../services/ui');
var UserModel = require("../models").User;

var router = express.Router();

router.get('/login', function(req, res) {

  // TODO: Go home if logged in already

  var data = {
    title: "Login",
    view: {
      body: {
        path: "../login/auth",
        data: {
          postUrl: "/auth/login",
          flash: { message: null },
          rememberMeParameter: "rememberMe"
        }
      }
    }
  };

  uiService.render(req, res, data);
});

router.post('/login', function(req, res) {
  res.send('Authenticate');
});


router.get('/logout', function(req, res) {
  res.send('logout');
});

module.exports = router;

