/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : bundle.config.js
 *  Date : 8/14/15 6:01 PM
 *  Description :
 *
 */
'use strict';
var assets = { root : "./static/assets/" };
assets.img = assets.root + "images/";
assets.css = assets.root + "stylesheets/";
assets.js = assets.root + "javascripts/";
assets.lib = assets.root + "lib/";
assets.bower = assets.lib + "bower_components/";

var prodLikeEnvs = ["production"];

module.exports = {

  bundle: {
    application: {
      options: {
        uglify:prodLikeEnvs,
        minCss: prodLikeEnvs,
        rev: prodLikeEnvs,
        sourcemaps: false,
        result: { type: 'plain' }
      },

      scripts: [
        // Vendor
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

        // Application
        assets.root + 'javascripts/*.js',
        assets.root + 'javascripts/**/**.js'
      ],

      styles: [
        // Vendor
        assets.lib + "bootstrap.min.css",
        assets.lib + "jquery-ui-1.11.4.custom/jquery-ui.theme.min.css",
        assets.bower + "alertifyjs/dist/css/alertify-bootstrap-3.css",
        assets.bower + "ionicons/css/ionicons.min.css",

        // Application
        assets.css + "style.css"
      ]
    }
  }
};
