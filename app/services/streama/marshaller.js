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
var async = require("async");
var settingsService = require("./settings");

var defaultRoles = conf.get("defaultData.roles");

var _getAuthoritiesForUser = function (user) {
  var auths = [];
  user.roles.forEach(function (userRole) {
    defaultRoles.forEach(function (role) {
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
    isContentManager: user.roles.indexOf('ROLE_CONTENT_MANAGER') != -1
  };

  if (user.invitationSent && user.uuid) {
    data.invitationLink = settingsService.getBaseUrl() + "/invite?uuid=" + user.uuid;
  }

  return data;
};

var sendJson = function (res, data, status) {
  if (!status) {
    status = 200;
  } else if (typeof status !== "number") {
    status = 500;
  }

  try { // Do not confuse the ids (_id vs id) used by frontend

    var convertIds = function (modelObj) {
      try {
        json = modelObj.toJSON();
        if (json._id && !json.id) {
          json.id = json._id;
        }
        return json;
      } catch (e) {
        //console.warn(e);
      }
      return null;
    };

    if (data instanceof Array) { // typeof Array
      var jsons = [];
      data.forEach(function (modelObj) {
        var json = convertIds(modelObj);
        if (json) {
          jsons.push(json);
        }
      });
      if (jsons.length > 0) {
        data = jsons;
      }
    } else {
      var json = convertIds(data);
      if (json !== null) {
        data = json;
      }
    }
  } catch (e) {
  }

  res.status(status).json(data);
};

exports.sendJson = sendJson;

exports.sendUserJson = function (res, user) {
  sendJson(res, _makePublicUser(user));
};

exports.sendUsersJson = function (res, users) {
  var data = [];
  users.forEach(function (user) {
    data.push(_makePublicUser(user));
  });
  sendJson(res, data);
};

exports.sendRolesJson = function (res, roles) {
  var data = [];
  roles.forEach(function (role) {
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
    src: file.getSrc(),
    originalFilename: file.originalFilename,
    extension: file.extension,
    contentType: file.contentType,
    size: file.size,
    dateCreated: file.dateCreated,
    quality: file.quality
  };

  sendJson(res, data);

};

exports.sendVideoJson = function (res, videos) {

  var prepData = function (video, callback) {

    var tasks = [];

    var mediaFiles = [];
    var subtitleFiles = [];
    video.files.forEach(function (file) {
      if (file.extension === ".srt") {
        subtitleFiles.push(file);
      } else {
        mediaFiles.push(file);
      }
    });

    var data = {
      id: video.id,
      dateCreated: video.dateCreated,
      lastUpdated: video.lastUpdated,
      overview: video.overview,
      imdb_id: video.imdb_id,
      vote_average: video.vote_average,
      vote_count: video.vote_count,
      popularity: video.popularity,
      original_language: video.original_language,
      apiId: video.apiId,

      files: mediaFiles,
      subtitles: subtitleFiles
    };

    if (video._type === "Movie") {

      data.title = video.title;
      data.release_date = video.release_date;
      data.backdrop_path = video.backdrop_path;
      data.poster_path = video.poster_path;

      tasks.push(function(cb) {
        video.getSimilarMovies(function (err, similar) {
          data.similarMovies = similar;
          cb(null);
        });
      });

    } else if (video._type === "Episode") {

      data.show = video.show;
      data.episodeString = video.episodeString;
      data.name = video.name;
      data.air_date = video.air_date;
      data.season_number = video.season_number;
      data.episode_number = video.episode_number;
      data.still_path = video.still_path;

      // TODO: Next Episode
    }

    async.series(tasks, function(err, result) {
      callback(data);
    });

  };

  if( videos instanceof Array) {
    var tasks = [];
    videos.forEach(function (video) {
      tasks.push(function(callback) {
        prepData(video, function (data) {
          callback(null, data);
        });
      });
    });

    async.series(tasks, function (err, results) {
      sendJson(res, results);
    });

  } else {
    prepData(videos, function(data) {
      sendJson(res, data);
    });
  }

};

exports.makeFullShowJson = function (tvShow) {

  var makeJSON = function (show) {
    var episodesWithFiles = 0;

    show.episodes.forEach(function (episode) {
      if (episode.files.length != 0) {
        episodesWithFiles++;
      }
    });

    return {
      id: show.id,
      dateCreated: show.dateCreated,
      lastUpdated: show.lastUpdated,
      name: show.name,
      overview: show.overview,
      apiId: show.apiId,
      backdrop_path: show.backdrop_path,
      poster_path: show.poster_path,
      first_air_date: show.first_air_date,
      original_language: show.original_language,
      vote_average: show.vote_average,
      imdb_id: show.imdb_id,
      popularity: show.popularity,
      episodesWithFilesCount: episodesWithFiles,
      episodesCount: show.episodes.length
    };
  };

  if (tvShow instanceof Array) {
    var data = [];
    tvShow.forEach(function (show) {
      data.push(makeJSON(show));
    });
    return data;
  } else {
    return makeJSON(tvShow);
  }

};

exports.makeFullViewingStatusJson = function (viewingStatus) {

  var makeJSON = function (status) {
    return {
      id: status.id,
      dateCreated: status.dateCreated,
      lastUpdated: status.lastUpdated,
      video: status.video,
      tvShow: status.tvShow,
      user: status.user,
      currentPlayTime: status.currentPlayTime,
      runtime: status.runtime
    };
  };

  if (viewingStatus instanceof Array) {
    var data = [];
    viewingStatus.forEach(function (status) {
      data.push(makeJSON(status));
    });
    return data;
  } else {
    return makeJSON(viewingStatus);
  }

};
