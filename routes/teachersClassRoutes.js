const express = require("express");
const Router = express.Router();
const User = require("./../models/userModel");
const CompleteClass = require("./../models/CompleteClass");

const axios = require("axios");

const { google } = require("googleapis");
const classroom = google.classroom("v1");

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
    // console.log(req.params.email);
    const email9 = req.params.email;
    // console.log(email9);
    var currentUser = await User.findOne({ email: email9 });
    var RefreshToken = currentUser.refreshToken;
    // console.log(RefreshToken);

  // User.findOne({email: email1} , function(err , user3){
  //   console.log(user3);
  // })

  // const accToekn = req.params.ac_token;

    oauth2Client.setCredentials({ refresh_token: RefreshToken });
    const res = await classroom.courses.list({
      teacherId: "me",
    })
    // .catch(e => {
    //   console.log("error occurred");
    //   console.error(e);
    //   throw e;
    // });
    
    console.log(res);
    //   const auth = new google.auth.GoogleAuth({
    //   scopes: [
    //       "https://www.googleapis.com/auth/classroom.courses",
    //       "https://www.googleapis.com/auth/classroom.courses.readonly",
    //     ],
    //   });

    // const authClient = await auth.getClient(req.params.accessToken);
    // google.options({ auth: authClient });

  
    resp.json(res);
    // resp.send(res.data);
  } catch (error) {
    next(error);
  }
});


Router.get("/teachersClass/:courseId", async (req, resp, next) => {
  try {
  const courseId = req.params.courseId;
  
  const currentClass = await CompleteClass.findOne({ courseId: courseId });
  
    
  resp.json(currentClass);
   } catch (error) {
    next(error);
  }
});

module.exports = Router;
