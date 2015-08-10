/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : user
 *  Date : 8/7/15 3:39 PM
 *  Description :
 *
 */
'use strict';
var express = require('express');
var uuid = require('uuid');

var utils = require("../utils");
var uiService = require("../services/streama/ui");
var marshal = require('../services/streama/marshaller');
var UserModel = require("../models").User;
var RoleModel = require("../models").Role;

var router = express.Router();

/**
 * List users? should be /user.json and not /user
 */
router.get('/', function (req, res) {
  if (req.user.roles.indexOf("ROLE_ADMIN") == -1) {
    marshal.sendUsersJson(res, []);
  } else {
    UserModel.find({deleted: false}, function (err, users) {
      if (err) {
        console.error(err);
        users = [];
      }
      marshal.sendUsersJson(res, users);
    });
  }
});

/**
 * Current User
 */
router.get('/current.json', function (req, res) {
  marshal.sendUserJson(res, req.user);
});

/**
 * Save User
 */
router.post('/save.json', function (req, res) {
  res.end();
});


/**
 * Check Availability?
 */
router.get('/checkAvailability.json', function (req, res) {
  var email = req.query.username;
  UserModel.findByEmail(email, function (err, found) {
    if (found) {
      marshal.sendJson(res, {error: "Email already registered!"});
    } else {
      marshal.sendJson(res, {});
    }
  });
});

/**
 * Save and invite
 */
router.post('/saveAndInviteUser.json', function (req, res) {
  var userData = req.body;
  userData.email = userData.username;
  userData.password = uuid.v1();
  userData.roles = [];
  userData.authorities.forEach(function (auth) {
    userData.roles.push(auth.authority);
  });

  // FIXME: Refactor client so it does send these anymore!!
  delete userData.username;
  delete userData.authorities;


  UserModel.create(userData, function (err, user) {
    if (err) {
      console.error(err);
      res.sendStatus(406);
    } else {

      if (!user.invitationSent && user.enabled) {
        user.uuid = uuid.v4();

        uiService.renderEmail(user, function (err, html) {
          if (!err) {

            var message = {
              subject: "You have been invited!",
              html: html
            };

            utils.email.send(user.email, message, function (error, info) {
              if (error) {
                console.error(error);
                marshal.sendUserJson(res, user);
              } else {
                user.invitationSent = true;
                console.log('Message sent: ' + info.response);

                user.save(function (err) {
                  if (err) {
                    console.error(err);
                  }
                  marshal.sendUserJson(res, user);
                });
              }
            });

          } else {
            console.error(err);
          }

        });


      } else {
        marshal.sendUserJson(res, user);
      }

    }
  });
});


/**
 * Save Profile
 */
router.post('/saveProfile.json', function (req, res) {
  var userData = req.body;
  var id = userData.id;
  delete userData.id;
  UserModel.findOneAndUpdate({_id: id}, userData, function (err) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

/**
 * Available roles
 */
router.get('/availableRoles.json', function (req, res) {
  RoleModel.find({}, function (err, roles) {
    marshal.sendRolesJson(res, roles);
  });
});


/**
 * Change password
 */
router.post('/changePassword.json', function (req, res) {
  var old = req.body.oldPassword;
  var newPwd = req.body.newPassword;
  var newRepeatPwd = req.body.repeatPassword;
  if (newPwd !== newRepeatPwd) {
    marshal.sendJson(res, {message: "Passwords do not match"}, 400);
    return;
  }

  var user = req.user;
  user.changePassword(old, newPwd, function (err) {
    if (err) {
      console.error(err);
      var msg = (typeof err == "string") ? err : "Check your password!";
      marshal.sendJson(res, {message: msg}, 400);
    } else {
      res.sendStatus(200);
    }
  });
});


/**
 * Delete a user
 */
router.delete("/delete.json", function (req, res) {
  var id = req.query.id;
  UserModel.findOneAndRemove({_id: id}, function(err) {
    res.sendStatus(200);
  });
});

module.exports = router;
