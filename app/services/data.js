/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : defaultdata
 *  Date : 8/8/15 2:08 PM
 *  Description :
 *
 */
'use strict';
var UserModel = require("../models/User");
var RoleModel = require("../models/Role");
var SettingsModel = require("../models/Settings");

var settingsService = require("./settings");

// TODO: Load these from a config file
var DEFAULT_ROLES = [
  {authority: "ROLE_ADMIN", displayName:"Admin"},
  {authority: "ROLE_CONTENT_MANAGER", displayName:"Content Manager"}
];

var DEFAULT_USERS = [
  {
    email: 'admin@streama.co.ke',
    password: 'admin',
    enabled: true,
    roles:[DEFAULT_ROLES[0].authority, DEFAULT_ROLES[1].authority]
  },

  {
    email: 'aksalj@streama.co.ke',
    password: 'pwd',
    enabled: true,
    roles:[DEFAULT_ROLES[1].authority]
  }
];


var createDefaultRoles = function () {

  var createIfAbsent = function (role) {
    RoleModel.find({authority: role.authority}, function(err, found) {
      if(!found) {
        RoleModel.create(role, function (err) {
          if(err){ console.error(err); }
        });
      }
    });
  };

  DEFAULT_ROLES.forEach(createIfAbsent);

};

var createDefaultUsers = function () {

  var createIfAbsent = function (userData) {
    UserModel.findByEmail(userData.email, function (err, found) {
      if (!found) {
        UserModel.create(userData, function (err) {
          if(err) { console.error(err); }
        });
      }
    })
  };

  DEFAULT_USERS.forEach(createIfAbsent);
};

var createDefaultSettings = function () {

  var createIfAbsent = function (settings) {
    SettingsModel.findBySettingsKey(settings.settingsKey, function (err, found) {
      if (!found) {
        SettingsModel.create(settings, function (err) {
          if(err){ console.error(err); }
        });
      }
    })
  };
  var defaultSettings = settingsService.getDefaultSettings();
  defaultSettings.forEach(createIfAbsent);
};


exports.populateWithDefaultData = function () {

  createDefaultRoles(function(err, roles) {
    if(err){
      console.error(err);
    } else {
      createDefaultUsers();
    }
  });

  createDefaultSettings();
};
