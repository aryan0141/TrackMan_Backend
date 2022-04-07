const express = require("express");
const Router = express.Router();
const User = require("./../models/userModel");
const CompleteClass = require("./../models/CompleteClass");

const axios = require("axios");

const { google } = require("googleapis");
const classroom = google.classroom("v1");

const mail = require("./../mailing/mail_server");

const GOOGLE_CLIENT_ID =
  "821931130263-d6pvkrhi1tjmcrmk2tdcbhp9mpgq3sqn.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

Router.get("/courseList/:email", async (req, resp, next) => {
   try {
    const email9 = req.params.email;
    var currentUser = await User.findOne({ email: email9 });
    var RefreshToken = currentUser.refreshToken;
    oauth2Client.setCredentials({ refresh_token: RefreshToken });
    const res = await classroom.courses.list({
      teacherId: "me",
    })
    resp.json(res);
  } catch (error) {
    mail.mailfunc("Error in /courseList/:email", error.toString());
    next(error);
  }
});


Router.get("/teachersClass/:courseId", async (req, resp, next) => {
  try {
  const courseId = req.params.courseId;
  
  const currentClass = await CompleteClass.findOne({ courseId: courseId });
  
    
  resp.json(currentClass);
   } catch (error) {
    mail.mailfunc("Error in /teachersClass/:courseId", error.toString());
    next(error);
  }
});

module.exports = Router;
