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
var conf = require("config");
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');

var utils = require("./utils");
var routes = require("./routes");
var authService = require("./services/auth");
var models = require("./models");
var uiService = require("./services/ui");

var app = express();

// Logs
utils.logger.setup(app, conf.util.getEnv('NODE_ENV'));

// Parsers
app.use(cookieParser());
app.use(cookieSession({ name: "streama", keys: ["98dVrs6twA", "yQfDCdJQbg"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Static & Views
app.set('view engine', 'ejs');
app.set('views', 'static/views');
app.use(express.static('static'));
// FIXME: Find cleaner way of doing this
app.use(express.static('static/assets/javascripts/streama-app/templates'));
app.use("/assets/fonts", express.static('static/assets/lib/bower_components/bootstrap/fonts'));
app.use("/template", express.static('static/assets/lib/bower_components/angular-ui-bootstrap/template'));

// Routes
//    API
app.use("/user(.json)?", authService.ensureAuthenticated, routes.UserRoutes);
app.use("/settings(.json)?", authService.ensureAuthenticated, routes.SettingsRoutes);

//    UI
app.use("/auth", routes.AuthRoutes);
app.use("/invite", routes.InviteRoutes);
app.use("/", authService.ensureAuthenticated, routes.UIRoutes);

//    404s
app.use(function (req, res) {
  var error = {
    code: 404,
    message: "NOT FOUND"
  };
  uiService.showError(req, res, error);
});


// Connect to DB and Start API Server
console.log('connecting to database....');
models.connect(function(err){
  if(err) throw err;

  // Insert default data.
  require('./services/defaultData')();

  // Start Http Server
  var options = conf.get("app.secure") ? conf.get("app.ssl") : null;
  var httpServer = new utils.HttpServer(app, options);
  var server = httpServer.start(conf.get("app.host"), conf.get("app.port"), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Streama listening at http%s://%s:%s', (conf.get("app.secure") ? "s" : ""), host, port);
  });

});

