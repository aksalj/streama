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
var uiService = require('../services/streama/ui');

var UserModel = require("../models/User");

var router = express.Router();

router.get('/', function (req, res) {

  var data = {
    view: {
      body: {
        path: "../invite/index",
        data: {
          setPasswordUrl: "/invite/setPassword",
          params: {
            uuid: req.query.uuid
          }
        }
      }
    }
  };

  uiService.render(req, res, data);

});

router.post('/setPassword', function (req, res) {

  var password = req.body.password;
  var passwordRepeat = req.body.passwordRepeat;
  var uuid = req.body.uuid;

  var cb = function (err, user) {
    if (!err && uuid && user && password && passwordRepeat && password == passwordRepeat && password.length > 5) {

      user.password = password;
      user.uuid = null;
      user.save(function (err) {
        if (err) {
          console.error(err);
        }
        res.redirect('/');
      });

    } else {
      // TODO: Proper error reporting
      console.error(err);
    }

    res.redirect('/invite');

  };

  UserModel.findByUuid(uuid, cb);
});

module.exports = router;

