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


var createDefaultRoles = function (cb) {

  RoleModel.collection.remove(); // Clear collection

  RoleModel.create(DEFAULT_ROLES, function (err) {
    var roles = [];
    if(!err) {
      for (var i = 1; i < arguments.length; i++) {
        roles = roles.concat(arguments[i]);
      }
    }
    cb(err, roles);
  });

};

var createDefaultUsers = function () {

  UserModel.collection.remove();

  UserModel.create(DEFAULT_USERS, function (err) {
    if(err) {
      console.error(err);
    }
  });

};

var createDefaultSettings = function () {

  SettingsModel.collection.remove();

  SettingsModel.create(settingsService.DEFAULT_SETTINGS, function (err) {
    if(err){
      console.error(err);
    }
  });

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
