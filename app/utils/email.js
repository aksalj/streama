/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : streama
 *  File : email
 *  Date : 8/10/15 8:15 PM
 *  Description :
 *
 */
'use strict';
var mailer = require("nodemailer");
var directTransport = require('nodemailer-direct-transport');

var SENDER = "Streama <streama@streama.co.ke>";

// FIXME: Unreliable to send email straight to receiver's MX
var transporter = mailer.createTransport(directTransport({name: "streama.co.ke", debug: true}));



exports.send = function (to, message, callback) {

  var mailOptions = {
    from: SENDER, // sender address
    to: to, // list of receivers
    subject: message.subject, // Subject line
    text: message.text, // plaintext body
    html: message.html // html body
  };

  console.info("Sending email...");
  transporter.sendMail(mailOptions, callback);

};
