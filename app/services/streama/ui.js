/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : ui
 *  Date : 8/8/15 5:53 PM
 *  Description :
 *
 */
'use strict';
var minify = require('html-minifier').minify;

var utils = require("./../../utils");
var settingsService = require("./settings");

var manifest = require("../../../manifest.json");

var paths = { base: "/", root: "/" }; // settingsService.getBaseUrl() for root?
paths.login = paths.root + "auth/login";
paths.logout = paths.root + "auth/logout";

var assets = { root : paths.root + "public/" };
assets.img = assets.root + "images/";

var styles = [
  assets.root + manifest.application.styles
];

var scripts = [
  assets.root + manifest.application.scripts
];


exports.render = function (req, res, data) {
  data.title = data.title || "Streama";
  data.layout = data.layout || "layouts/main";

  data.view = data.view || null;
  data.auth = {
    user: req.user
  };

  data.paths = paths;
  data.assets = assets;
  data.styles = styles;
  data.scripts = scripts;

  if(utils.isProduction()) { // Minify HTML in production
    res.render(data.layout, data, function (err, html) {
      if (err) throw err;
      html = minify(html, {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true
      });
      res.send(html);
    });
  } else {
    res.render(data.layout, data);
  }
};

exports.renderEmail = function(user, callback) {

  var emailData = {
    title: "Invitation",
    inviteUrl: settingsService.getBaseUrl() + "/invite?uuid=" + user.uuid
  };

  //
  var app = require("../../index");
  app.render('mail/userInvite', emailData, callback);
};

exports.showError = function (req, res, error) {
  var data = {
    env: {
      development: true
    },
    exception: error
  };

  res.status(error.code || 500);

  res.render("error", data);
};
