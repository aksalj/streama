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

  data.view = data.view || null;
  data.auth = {
    user: req.user
  };

  data.paths = paths;
  data.assets = assets;
  data.styles = [

    //assets.root + "lib/bootstrap/dist/css/bootstrap-theme.min.css",
    assets.root + "lib/bootstrap.min.css",
    assets.root + "lib/alertify/themes/alertify.core.css",
    assets.root + "lib/alertify/themes/alertify.bootstrap3.css",
    assets.root + "lib/ionicons/css/ionicons.min.css",
    assets.root + "lib/jquery-ui-1.11.4.custom/jquery-ui.theme.min.css",

    assets.css + "style.css"
  ];
  data.scripts = [

    assets.root + "lib/jquery/dist/jquery.min.js",
    assets.root + "lib/jquery-ui-1.11.4.custom/jquery-ui.min.js",
    assets.root + "lib/angular/angular.js",
    assets.root + "lib/alertify/alertify.min.js",
    assets.root + "lib/angular-local-storage/dist/angular-local-storage.min.js",
    assets.root + "lib/angular-sanitize/angular-sanitize.min.js",
    assets.root + "lib/angular-ui-router/release/angular-ui-router.min.js",
    assets.root + "lib/angular-ui-slider/src/slider.js",
    assets.root + "lib/Autolinker.js/dist/Autolinker.js",
    assets.root + "lib/bootstrap/dist/js/bootstrap.min.js",
    assets.root + "lib/lodash/lodash.min.js",
    assets.root + "lib/mousetrap/mousetrap.min.js",
    assets.root + "lib/ng-file-upload/ng-file-upload-all.min.js",
    assets.root + "lib/ui-bootstrap-custom-build/ui-bootstrap-custom-0.13.1.min.js",

    assets.js + "streama-app.js",

    assets.js + "controllers/admin-ctrl.js",
    assets.js + "controllers/admin-movie-ctrl.js",
    assets.js + "controllers/admin-movies-ctrl.js",
    assets.js + "controllers/admin-settings-ctrl.js",
    assets.js + "controllers/admin-show-ctrl.js",
    assets.js + "controllers/admin-shows-ctrl.js",
    assets.js + "controllers/admin-users-ctrl.js",
    assets.js + "controllers/dash-ctrl.js",
    assets.js + "controllers/player-ctrl.js",
    assets.js + "controllers/profile-ctrl.js",
    assets.js + "controllers/modal-file-browser-ctrl.js",
    assets.js + "controllers/modal-file-ctrl.js",
    assets.js + "controllers/modal-movie-ctrl.js",
    assets.js + "controllers/modal-tvshow-ctrl.js",
    assets.js + "controllers/modal-user-ctrl.js",
    assets.js + "controllers/modal-video-ctrl.js",

    assets.js + "directives/admin-episode-directive.js",

    assets.js + "services/api-service.js",
    assets.js + "services/filters.js",
    assets.js + "services/modal-service.js",
    assets.js + "services/socket-service.js",
    assets.js + "services/upload-service.js"


  ];

  res.render("layouts/main", data);
};

exports.renderInviteEmail = function (req, res, user) {
  // HUH: user is user to be invited?

  var cb = function (err, settings) {
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

  res.status(error.code || 500);

  res.render("error", data);
};
