const express = require("express");
const Router = express.Router();
const completeClassv2 = require("./../models/CompleteClassv2");
const mail = require("./../mailing/mail_server");
const { auth } = require("../utils/authMiddleware");

Router.post("/addFileName", async (req, res, next) => {
  try {
    const { filename } = req.body;
    completeClass
      .find({ fileNames: { $elemMatch: { $eq: filename.name } } })
      .then((classFound1) => {
        if (classFound1[0] == null) {
          completeClass
            .findOne({ name: filename.classname })
            .then((classFound2) => {
              classFound2.fileNames.push(filename.name);
              completeClass.findByIdAndUpdate(
                classFound2._id,
                {
                  fileNames: classFound2.fileNames,
                },
                function (err, docs) {
                  if (err) {
                    mail.mailfunc("Error in /addFileName", err.toString());
                    console.log("Error happened");
                  } else {
                    res.json({ msg: "success", status: 200 });
                  }
                }
              );
            });
        } else {
          //console.log("Filename is already registered");
          res.json({ msg: "Already registered", status: 400 });
        }
      });
  } catch (error) {
    mail.mailfunc("Error in /addFileName", error.toString());
    next(error);
  }
});

Router.post("/deleteFileName", async (req, res, next) => {
  try {
    const { filename } = req.body;
    //console.log(filename);

    completeClass
      .find({ fileNames: { $elemMatch: { $eq: filename.name } } })
      .then((classFound1) => {
        if (classFound1[0] == null) {
          //console.log("classfound is null");
          //res.status(400);
          res.json({ msg: "Already registered", status: 400 });
        } else {
          //console.log("Filename is already registered");

          completeClass
            .findOne({ name: filename.classname })
            .then((classFound2) => {
              //console.log(classFound2);
              //classFound2.fileNames.push(filename.name);
              classFound2.fileNames = classFound2.fileNames.filter(
                (v) => v !== filename.name
              );
              completeClass.findByIdAndUpdate(
                classFound2._id,
                {
                  fileNames: classFound2.fileNames,
                },
                function (err, docs) {
                  if (err) {
                    res.json({ msg: "Already registered", status: 400 });
                    console.log("Error happened");
                  } else {
                    res.json({ msg: "success", status: 200 });
                    //res.status(200);
                    //console.log("successfully deleted");
                  }
                }
              );
            });

          res.status(200);
        }
      });
  } catch (error) {
    mail.mailfunc("Error in /deleteFileName", error.toString());
    next(error);
  }
});

Router.post("/updateCuttOffMin", auth, async (req, res, next) => {
  try {
    const { cuttOffMin1 } = req.body;
    // console.log(cuttoffMin1);
    //console.log(cuttOffMin1);
    const cuttOffMin = Number(cuttOffMin1.cuttOffMin);
    const className1 = cuttOffMin1.className1;
    
    const teacherName = req.user.email;

    completeClassv2.findOne({ name: className1 , teacher: teacherName }).then((resp) => {
      completeClassv2.findByIdAndUpdate(
        resp._id,
        {
          cutOffMins: cuttOffMin,
          // totalClasses: classFound.totalClasses,
          // totalDuration: classFound.totalDuration,
          // StudentsData: classFound.StudentsData,
        },
        function (err, docs) {
          if (err) {
            res.json({ msg: "Already registered", status: 400 });
            console.log("Error happened");
          } else {
            res.json({ msg: "success", status: 200 });
            console.log("success");
          }
        }
      );
    });
  } catch (error) {
    mail.mailfunc("Error in /updateCuttOffMin", error.toString());
    next(error);
  }

  //console.log(cuttOffMin);
});

Router.post("/updateWeightageArr", auth,  async (req, res, next) => {
  // console.log("API called");
  try {
    const { weightAgeDoc } = req.body;
    const w1 = weightAgeDoc.w1;
    const w2 = weightAgeDoc.w2;
    const w3 = weightAgeDoc.w3;
    const className2 = weightAgeDoc.className2;
    const arr23 = [w1, w2, w3];

    const teacherName = req.user.email;

    completeClassv2.findOne({ name: className2 , teacher: teacherName }).then((classFound2) => {
      completeClassv2.findByIdAndUpdate(
        classFound2._id,
        {
          weightAge: arr23,
        },
        function (err, docs) {
          if (err) {
            res.json({ msg: "Error happened", status: 400 });
            //console.log("Error happened");
          } else {
            res.json({ msg: "success", status: 200 });
            //console.log("success on weightAge");
          }
        }
      );
    });
  } catch (error) {
    mail.mailfunc("Error in /updateWeightageArr", error.toString());
    next(error);
  }
});

module.exports = Router;
