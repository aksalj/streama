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
var SettingsModel = require("./../models").Settings;

var assets = { root : "/assets/" };
assets.img = assets.root + "images/";
assets.css = assets.root + "stylesheets/";
assets.js = assets.root + "javascripts/";

var paths = { root: "/" };
paths.login = paths.root + "auth/login";
paths.logout = paths.root + "auth/logout";


exports.render = function (req, res, data) {
  data.title = data.title || "Streama";
  data.assets = assets;
  data.paths = paths;
  data.view = data.view || null;
  data.user = req.user; // Must have authed with passport

  res.render("layouts/main", data);
};

exports.renderInviteEmail = function (req, res) {
  // ${streama.Settings.findBySettingsKey('Base URL')?.value}/invite?uuid=${user?.uuid}

  var cb = function (err, settings) {
    var user = req.user;
    var data = {
      title: "Invitation",
      inviteUrl: settings.value + "/invite?uuid=" + user.uuid
    };
    res.render("mail/userInvite", data);
  };

  SettingsModel.findBySettingsKey('Base URL', cb);

};

exports.showError = function (req, res, error) {
  var data = {
    env: {
      development: true
    },
    exception: error
  };

  // TODO: Set HTTP code??
  res.render("error", data);
};
