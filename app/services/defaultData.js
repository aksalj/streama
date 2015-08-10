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
var conf = require("config");
var UserModel = require("../models/User");
var RoleModel = require("../models/Role");
var SettingsModel = require("../models/Settings");

var settingsService = require("./settings");

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

  var roles = conf.get("defaultData.roles");
  roles.forEach(createIfAbsent);

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

  var users = conf.get("defaultData.users");
  users.forEach(createIfAbsent);
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


exports = module.exports = function (){
  createDefaultRoles();
  createDefaultUsers();
  createDefaultSettings();
  return true;
};
