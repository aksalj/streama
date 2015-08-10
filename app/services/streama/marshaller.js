/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : marshaller
 *  Date : 8/9/15 11:32 AM
 *  Description :
 *
 */
'use strict';
var conf = require("config");
var settingsService = require("./settings");

var defaultRoles = conf.get("defaultData.roles");

var _getAuthoritiesForUser = function(user) {
  var auths = [];
  user.roles.forEach(function (userRole) {
    defaultRoles.forEach(function(role) {
      if (role.authority === userRole) {
        auths.push(role);
      }
    });
  });
  return auths;
};

var _makePublicUser = function (user) {

  var data = {
    id: user._id,
    username: user.email,
    authorities: _getAuthoritiesForUser(user),
    enabled: user.enabled,
    dateCreated: user.dateCreated,
    fullName: user.fullName,
    invitationSent: user.invitationSent,
    favoriteGenres: user.favoriteGenres,
    isAdmin: user.roles.indexOf('ROLE_ADMIN') != -1,
    isContentManager:  user.roles.indexOf('ROLE_CONTENT_MANAGER') != -1
  };

  if (user.invitationSent && user.uuid) {
    data.invitationLink = settingsService.getBaseUrl() + "/invite?uuid=" + user.uuid;
  }

  return data;
};

var sendJson = function (res, data, status) {
  if(!status){
    status = 200;
  } else if (typeof status !== "number") {
    status = 500;
  }
  res.status(status).json(data);
};

exports.sendJson = sendJson;

exports.sendUserJson = function (res, user) {
  sendJson(res, _makePublicUser(user));
};

exports.sendUsersJson = function (res, users) {
  var data = [];
  users.forEach(function(user) {
    data.push(_makePublicUser(user));
  });
  sendJson(res, data);
};

exports.sendRolesJson = function(res, roles) {
  var data = [];
  roles.forEach(function(role){
    data.push({
      authority: role.authority,
      displayName: role.displayName
    });
  });
  sendJson(res, roles);
};


exports.sendFileJson = function (res, file) {
  var data = {
    id: file._id,
    name: file.name,
    sha256Hex: file.sha256Hex,
    src: file.src,
    originalFilename: file.originalFilename,
    extension: file.extension,
    contentType: file.contentType,
    size: file.size,
    dateCreated: file.dateCreated,
    quality: file.quality
  };

  sendJson(res, data);

};
exports.sendMovieJson = function (res, movie) {};
exports.sendVideoJson = function (res, video) {};
exports.sendFullShowJson = function (res, tvShow) {};
exports.sendFullViewingStatusJson = function (res, viewingStatus) {};
exports.sendFullMovieJson = function(res, movie) {};
