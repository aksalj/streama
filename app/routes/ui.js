/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : ui
 *  Date : 8/8/15 4:17 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var router = express.Router();
var uiService = require("./../services/ui");



router.get('/', function(req, res) {

  // TODO: Login first??

  var data = {
    view:{
      head: null,
      body: {
        path: "../index",
        data: {}
      }
    }
  };

  uiService.render(req, res, data);
});



router.use(function (req, res) {
  // TODO: catch errors

  uiService.showError(req, res, null);
});


module.exports = router;
