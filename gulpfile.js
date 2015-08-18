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
var gulp = require('gulp');
var del = require('del');
var flatten = require('gulp-flatten');
var bundle = require('gulp-bundle-assets');

var CONFIG = "./manifest.config.js";
var SOURCE = "./static/assets/";
var DESTINATION = "./static/public/";


gulp.task('clean', function(cb) {
  del(DESTINATION, cb);
});


gulp.task('copyFonts', ["clean"], function() {
  var src = SOURCE + "**/*.{eot,ttf,woff}";
  var dst = DESTINATION + "fonts";
  return gulp.src(src).pipe(flatten()).pipe(gulp.dest(dst));
});

gulp.task('copyImages', ["clean"], function() {
  var src = [
    SOURCE + "images/*.{gif,ico,png}",
    SOURCE + "images/**/*.{gif,ico,png}"
  ];
  var dst = DESTINATION + "images";
  return gulp.src(src).pipe(gulp.dest(dst));
});

gulp.task('copyTemplates', ["clean"], function() {
  var src = [
    SOURCE + "javascripts/streama-app/templates/*.tpl.htm",
    SOURCE + "lib/bower_components/angular-ui-bootstrap/template/**/*.html"
  ];
  var dst = DESTINATION + "templates";
  return gulp.src(src).pipe(gulp.dest(dst));
});


gulp.task('build', ["clean", "copyFonts", "copyImages", "copyTemplates"], function () {
  return gulp.src(CONFIG)
    .pipe(bundle({
      quietMode: true
    }))

    .pipe(bundle.results({
      dest: './',
      fileName: 'manifest'
    }))

    .pipe(gulp.dest(DESTINATION));
});
