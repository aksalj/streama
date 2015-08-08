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
var passport = require('passport');

// Auth strategies
var LocalStrategy = require('passport-local').Strategy;

var uiService = require('../services/ui');
var UserModel = require("../models").User;

var router = express.Router();

{ // Passport

  passport.use(new LocalStrategy(
    {
      usernameField: "j_username",
      passwordField: "j_password"
    },
    function (username, password, done) {
      var msg = "Sorry, we were not able to find a user with that username and/or password."; // i18n?
      UserModel.findByUsername(username, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: msg});
        }
        if (!user.validPassword(password)) {
          return done(null, false, {message: msg});
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function (user, done) {
    console.log("Serialize");
    done(null, user.username);
  });

  passport.deserializeUser(function (id, done) {
    console.log("Deserialize");
    UserModel.findByUsername(id, function (err, user) {
      done(err, user);
    });
  });

}


router.get('/login', function(req, res) {

  if(req.isAuthenticated()) {
    res.redirect('/');
  } else {

    var data = {
      title: "Login",
      view: {
        body: {
          path: "../login/auth",
          data: {
            postUrl: "/auth/login",
            message: req.flash("error"),
            rememberMeParameter: "rememberMe"
          }
        }
      }
    };

    uiService.render(req, res, data);
  }
});


router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
}));


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

