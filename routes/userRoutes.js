
const express = require("express");
const Router = express.Router();
const { google } = require("googleapis");
const User = require("./../models/userModel");
const axios = require("axios");


const GOOGLE_CLIENT_ID =
  "821931130263-d6pvkrhi1tjmcrmk2tdcbhp9mpgq3sqn.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);


const classroom = google.classroom({ version: "v1", auth: oauth2Client });


var ac_t = null;

Router.post("/create-tokens", async (req, res, next) => {
  try {
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);

    const user3 = {
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      picture: "",
      access_token: tokens.access_token,
    };
    ac_t = tokens.access_token;

    if (tokens.refresh_token) {
      const code1 = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };
      const resp = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${code1.accessToken}`
      );
      // const resp =  await func1(code1);
      console.log(resp);

      const user2 = {
        name: resp.data.name,
        firstName: resp.data.given_name,
        lastName: resp.data.family_name,
        email: resp.data.email,
        picture: resp.data.picture,
        refreshToken: code1.refreshToken,
      };
      User.create(user2);

      user3.name = resp.data.name;
      user3.firstName = resp.data.given_name;
      user3.lastName = resp.data.family_name;
      user3.email = resp.data.email;
      user3.picture = resp.data.picture;

      //access_token;
    } else {
      const code1 = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };
      const resp = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${code1.accessToken}`
      );

      user3.name = resp.data.name;
      user3.firstName = resp.data.given_name;
      user3.lastName = resp.data.family_name;
      user3.email = resp.data.email;
      user3.picture = resp.data.picture;

      // const user3 = {
      //     name: resp.data.name,
      //     firstName: resp.data.given_name,
      //     lastName: resp.data.family_name,
      //     email: resp.data.email,
      //     picture: resp.data.picture,
      //     //   refreshToken: code1.refreshToken,
      //     access_token: code1.accessToken,
      // };
    }

    res.send(user3);
    //res.send(code);
  } catch (error) {
    next(error);
  }
});

Router.get("/courseList/:email", async (req, resp, next) => {
  // try {
  
  const email9 = req.params.email;
 
  var currentUser = await User.findOne({ email: email9 });
  var RefreshToken = currentUser.refreshToken;
  //console.log(RefreshToken);

  oauth2Client.setCredentials({
    refresh_token: RefreshToken,
    access_token: ac_t,
  });
  const res = await classroom.courses.list({
    teacherId: "me",
  });
  //console.log(res);
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
  resp.json(res.data);
  // resp.send(res.data);
  // } catch (error) {
  //   next(error);
  // }
});

module.exports = Router;
