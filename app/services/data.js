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

var DEFAULT_ROLES = [
  {authority: "ROLE_ADMIN", displayName:"Admin"},
  {authority: "ROLE_CONTENT_MANAGER", displayName:"Content Manager"}
];

var DEFAULT_USERS = [
  {
    username: 'admin',
    password: 'admin',
    enabled: true,
    roles:[]
  }
];

var DEFAULT_SETTINGS = [
  {
    settingsKey: 'Upload Directory',
    description: 'This setting provides the application with your desired upload-path for all files. ' +
    'The default so far has been /data/streama. Remember: if you change this path, copy all the files (that were previously added) into the new directory.',
    required: true
  },

  {
    settingsKey: 'TheMovieDB API key',
    description: 'This API-key is required by the application to fetch all the nice Movie/Episode/Show data for you. Get one for free at https://www.themoviedb.org/',
    required: true
  },

  {
    settingsKey: 'Base URL',
    value: 'http://localhost:3000/',
    description: 'The Base-URL is used for the videos and the link in the invitation-email.',
    required: true
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

var createDefaultUsers = function (roles) {

  // TODO: Give admin all roles?
  roles.forEach(function(role) {
    DEFAULT_USERS[0].roles.push(role._id);
  });


  UserModel.collection.remove();

  UserModel.create(DEFAULT_USERS, function (err) {
    if(err) {
      console.error(err);
    }
  });

};

var createDefaultSettings = function () {

  SettingsModel.collection.remove();

  SettingsModel.create(DEFAULT_SETTINGS, function (err) {
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
      createDefaultUsers(roles);
    }
  });

  createDefaultSettings();
};
