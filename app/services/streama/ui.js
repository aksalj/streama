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
var settingsService = require("./settings");


var paths = { root: settingsService.getBaseUrl() };
paths.login = paths.root + "auth/login";
paths.logout = paths.root + "auth/logout";

var assets = { root : paths.root + "assets/" };
assets.img = assets.root + "images/";
assets.css = assets.root + "stylesheets/";
assets.js = assets.root + "javascripts/";
assets.lib = assets.root + "lib/";
assets.bower = assets.lib + "bower_components/";


// Ideally these should be compiled into single files.
var styles = [
  assets.lib + "bootstrap.min.css",
  assets.lib + "jquery-ui-1.11.4.custom/jquery-ui.theme.min.css",
  assets.bower + "alertifyjs/dist/css/alertify-bootstrap-3.css",
  assets.bower + "ionicons/css/ionicons.min.css",

  assets.css + "style.css"
];

var scripts = [
  assets.bower + "jquery/dist/jquery.min.js",
  assets.root + "lib/jquery-ui-1.11.4.custom/jquery-ui.min.js",

  assets.bower + "alertifyjs/dist/js/alertify.js",
  assets.bower + "bootstrap/dist/js/bootstrap.min.js",
  assets.bower + "angular/angular.js",
  assets.bower + "angular-bootstrap/ui-bootstrap-tpls.js",
  assets.bower + "angular-local-storage/dist/angular-local-storage.min.js",
  assets.bower + "angular-sanitize/angular-sanitize.min.js",
  assets.bower + "angular-ui-router/release/angular-ui-router.min.js",
  assets.bower + "angular-ui-slider/src/slider.js",
  assets.bower + "Autolinker.js/dist/Autolinker.min.js",
  assets.bower + "lodash/lodash.min.js",
  assets.bower + "mousetrap/mousetrap.min.js",
  assets.bower + "ng-file-upload/ng-file-upload-all.min.js",
  assets.bower + "venturocket-angular-slider/build/angular-slider.min.js",

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


exports.render = function (req, res, data) {
  data.title = data.title || "Streama";

  data.view = data.view || null;
  data.auth = {
    user: req.user
  };

  data.paths = paths;
  data.assets = assets;
  data.styles = styles;
  data.scripts = scripts;

  res.render("layouts/main", data);
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
