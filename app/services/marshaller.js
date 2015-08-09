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

var settingsService = require("./settings");

var sendJson = function (res, data) {

  res.json(data);
};

exports.sendJson = sendJson;

exports.sendUserJson = function (res, user) {

  var data = {
    id: user._id,
    username: user.username,
    authorities: user.roles,
    enabled: user.enabled,
    dateCreated: user.dateCreated,
    fullName: user.fullName,
    invitationSent: user.invitationSent,
    favoriteGenres: user.favoriteGenres,
    isAdmin: user.roles.indexOf('ROLE_ADMIN') != -1,
    isContentManager:  user.roles.indexOf('ROLE_CONTENT_MANAGER') != -1
  };

  if (user.invitationSent && user.uuid) {
    data.invitationLink = settingsService.BASE_URL + "/invite?uuid=" + user.uuid;
  }

  sendJson(res, data);

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
