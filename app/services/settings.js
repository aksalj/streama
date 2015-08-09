/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : settings
 *  Date : 8/8/15 2:32 PM
 *  Description :
 *
 */
'use strict';

// TODO: Load these from a config file & DB

var BASE_URL = "http://localhost:3000/";

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
    value: BASE_URL,
    description: 'The Base-URL is used for the videos and the link in the invitation-email.',
    required: true
  }

];


exports.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
exports.BASE_URL = BASE_URL;
