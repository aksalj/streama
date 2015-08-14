/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : gulpfile.js
 *  Date : 8/14/15 5:57 PM
 *  Description :
 *
 */
'use strict';
var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  bundle = require('gulp-bundle-assets');

var CONFIG = "./manifest.config.js";
var URL_PREFIX = "/public/";
var DESTINATION = "./static/public";

gulp.task('bundle', ["clean"], function () {
  return gulp.src(CONFIG)
    .pipe(bundle())

    .pipe(bundle.results({
      dest: './',
      pathPrefix: URL_PREFIX,
      fileName: 'manifest'
    }))

    .pipe(gulp.dest(DESTINATION));
});

gulp.task('clean', function() {
  return gulp.src(DESTINATION, { read: false })
    .pipe(rimraf());
});
