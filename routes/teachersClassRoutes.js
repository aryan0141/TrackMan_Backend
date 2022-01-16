const express = require("express");
const Router = express.Router();
const User = require("./../models/userModel");

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
  // try {
    // console.log(req.params.email);
    const email9 = req.params.email;
    // console.log(email9);
    var currentUser = await User.findOne({ email: email9 });
    var RefreshToken = currentUser.refreshToken;
    console.log(RefreshToken);

  // User.findOne({email: email1} , function(err , user3){
  //   console.log(user3);
  // })

  // const accToekn = req.params.ac_token;

    oauth2Client.setCredentials({ refresh_token: RefreshToken });
    const res = await classroom.courses.list({
      teacherId: "me",
    });
    console.log(res);
    //   const auth = new google.auth.GoogleAuth({
    //   scopes: [
    //       "https://www.googleapis.com/auth/classroom.courses",
    //       "https://www.googleapis.com/auth/classroom.courses.readonly",
    //     ],
    //   });

    // const authClient = await auth.getClient(req.params.accessToken);
    // google.options({ auth: authClient });

    // const res = await classroom.courses.list({
    // Restricts returned courses to those in one of the specified states The default value is ACTIVE, ARCHIVED, PROVISIONED, DECLINED.
    //courseStates: "placeholder-value",
    // Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.
    //pageSize: "placeholder-value",
    // nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
    //pageToken: "placeholder-value",
    // Restricts returned courses to those having a student with the specified identifier. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
    // studentId: "placeholder-value",
    // Restricts returned courses to those having a teacher with the specified identifier. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
    // teacherId: "me",
    // });
    // console.log(res.data);
    // const resp = await axios.get
    resp.json(res);
    // resp.send(res.data);
  // } catch (error) {
  //   next(error);
  // }
});

module.exports = Router;
