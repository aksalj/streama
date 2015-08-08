/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : auth
 *  Date : 8/8/15 9:22 PM
 *  Description :
 *
 */
'use strict';

exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  else {
    // HUH: Redirect or just send error?
    res.redirect('/auth/login');
  }
};
