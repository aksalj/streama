/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : invite
 *  Date : 8/8/15 7:30 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var uiService = require('../services/ui');

var router = express.Router();

router.get('/invite', function(req, res) {

  var data = {
    title: "Invitation",
    view: {
      body: {
        path: "../invite/index",
        data: {
          params: {
            uuid: null
          }
        }
      }
    }
  };

  uiService.render(req, res, data);
  
});

module.exports = router;

