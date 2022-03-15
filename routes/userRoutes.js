const express = require("express");
const Router = express.Router();
const { google } = require("googleapis");
const User = require("./../models/userModel");
const CompleteClass = require("./../models/CompleteClass");
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
      console.log("Refresh Toeken", tokens.refresh_token);
      const resp = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${code1.accessToken}`
      );
      // const resp =  await func1(code1);
      //console.log(resp);

      const user2 = {
        name: resp.data.name,
        firstName: resp.data.given_name,
        lastName: resp.data.family_name,
        email: resp.data.email,
        picture: resp.data.picture,
        refreshToken: code1.refreshToken,
      };
      User.findOne({ email: user2.email }, function (err, existingUser) {
        if (existingUser == null) {
          console.log("New User");
          User.create(user2);
        } else {
          // console.log("Already exist");
          // console.log(existingUser._id);
          User.findByIdAndUpdate(
            existingUser._id,
            {
              refreshToken: user2.refreshToken,
            },
            function (err, docs) {
              if (err) {
                console.log("Error happened");
              } else {
                console.log("success");
              }
            }
          );
        }
      });
      //User.create(user2);

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
  }).catch(e => {
    resp.json({ msg: "NoPermission", status: 400 });
    console.log("error occurred");
    console.error(e);
    throw e;
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

  // console.log(res.data);
  // const resp = await axios.get
  resp.json(res.data);
  // resp.send(res.data);
  // } catch (error) {
  //   next(error);
  // }
});

Router.get(
  "/createCompleteClass/:email/:courseId/:courseName/:ac_t",
  async (req, resp, next) => {
    const email9 = req.params.email;

    var RefreshToken = null;
    ac_t = req.params.ac_t;
    //console.log(req.params.courseId);

    const func2 = async () => {
      //console.log(RefreshToken , ac_t);

      oauth2Client.setCredentials({
        refresh_token: RefreshToken,
        access_token: ac_t,
      });

      //var currentClass = await
      CompleteClass.find({ courseId: req.params.courseId }).then(
        (currentClass) => {
          if (currentClass.length < 1) {
            var class1 = {
              name: req.params.courseName,
              fileNames: [],
              uploadNames: [],
              courseId: req.params.courseId,
              totalDuration: 0,
              StudentsData: [],
            };

            class1.fileNames.push(req.params.courseName);
            //const res =
            classroom.courses.students
              .list({
                courseId: `${req.params.courseId}`,
              })
              .then((res) => {
                //console.log(res.data.students[0].profile);
                const students = res.data.students;
                for (let x = 0; x < students.length; x++) {
                  class1.StudentsData.push({
                    name: students[x].profile.name.fullName,
                    duration: 0,
                    email: students[x].profile.emailAddress,
                  });
                }
                CompleteClass.create(class1);
                resp.json({ msg: "success", status: 200 });
              });
          }
        }
      );
    };

    //var currentUser = await
    User.findOne({ email: email9 }).then((currentUser) => {
      RefreshToken = currentUser.refreshToken;
      func2();
    });
  }
);

Router.get(
  "/teachersClass/:courseId/:email/:ac_token",
  async (req, resp, next) => {
    try {
      const email9 = req.params.email;
      var RefreshToken1 = null;
      ac_token = req.params.ac_token;
      const courseId = req.params.courseId;

      const func3 = async () => {
        oauth2Client.setCredentials({
          refresh_token: RefreshToken1,
          access_token: ac_token,
        });

        const res = await classroom.courses.teachers
          .get({
            courseId: courseId,
            userId: "me",
          })
          .then((teacherYes) => {
            // console.log("hello");
            // console.log(teacherYes);
            if (teacherYes == null) {
              console.log("Unauthorized User");
            } else {
              const currentClass = CompleteClass.findOne({
                courseId: courseId,
              }).then((currentClass) => {
                resp.json(currentClass);
              });
              // resp.json(currentClass);
            }
          })
          .catch((error) => {
            res.json({ msg: "success", status: 200 });
            console.error(error);
          });
      };

      User.findOne({ email: email9 }).then((currentUser) => {
        RefreshToken1 = currentUser.refreshToken;
        func3();
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = Router;
