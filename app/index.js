/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : index
 *  Date : 8/7/15 1:54 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var routes = require("./routes");
var dataService = require('./services/data');

var app = express();

// Static & Views
app.set('view engine', 'ejs');
app.set('views', 'static/views');
app.use(express.static('static'));

// Routes
app.use("/auth", routes.AuthRoutes);
app.use("/user", routes.UserRoutes);
app.get("/", routes.UIRoutes);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Streama listening at http://%s:%s', host, port);

  dataService.populateWithDefaultData();

});
