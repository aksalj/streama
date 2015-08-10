/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : httpServer
 *  Date : 8/10/15 1:51 PM
 *  Description :
 *
 */
'use strict';
var fs = require('fs');
var https = require('https');

var Server = function(app, ssl) {

  this.start = function(host, port, callback) {
    var _server = null;
    if (ssl) {
      var options = {
        key: fs.readFileSync(ssl.key),
        cert: fs.readFileSync(ssl.cert)
        //ca: fs.readFileSync(ssl.ca)
      };
      _server = https.createServer(options, app).listen(ssl.port, host, callback);
    } else {
      _server = app.listen(port, host, callback);
    }
    return _server;
  };

};

exports = module.exports = Server;
