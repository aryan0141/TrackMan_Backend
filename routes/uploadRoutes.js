const express = require("express");
const Router = express.Router();
const multer = require("multer");
//const csv = require('csv-parser');
const fs = require("fs");
const csv = require("csvtojson");
var subsrt = require("subsrt");
const { resourceLimits } = require("worker_threads");
const completeClass = require("./../models/CompleteClass");
const everyClass = require("./../models/EveryClass");
const everySBV = require("./../models/EverySBV");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single("file");

Router.post("/upload", async (req, res, next) => {
  try {
    console.log("hi");
    //console.log(req.file);
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      // console.log(req.file);
      if (
        req.file.mimetype === "application/octet-stream" ||
        req.file.mimetype === "text/csv" ||
        req.file.mimetype === "application/vnd.ms-excel"
      ) {
        // console.log(req.file);
        // return res.status(200).send(req.file);
      } else {
        console.log("ERROR HERE");
        return res.status(400).json({ msg: "Unsuitable file type" });
      }
    });
    //res.send("success");
  } catch (error) {
    next(error);
  }
});

Router.post("/addClass", async (req, res, next) => {
  var results = [];
  let results1 = [];
  const { fileName } = req.body;
  //console.log(fileName);
  const ext = fileName.split(".");
  const exten = ext[ext.length - 1];

  if (exten === "csv") {
    // const st1 = fileName.split(" Lecture")[0];
    // const st2 = st1.split(" ");
    // const st3 = st2[st2.length - 1];
    const st1 = fileName.split(" - Attendance Report.csv");
    const st2 = st1[0];
    const st3 = st2.substring(17, st2.length);
    // console.log(st3);
    var className1 = "";
    completeClass
      .find({ fileNames: { $elemMatch: { $eq: st3 } } })
      .then((classFound11) => {
        console.log(classFound11);
        className1 = classFound11[0].name;
        courseId1 = classFound11[0].courseId;
        const thresholdMins1 = classFound11[0].cutOffMins;
        // console.log(classFound11);
        // if(!classFound11.fileNames.includes(st3)){
        //   res.json({ msg: "FileName does not matches with the class Name", status: 400 });
        // }

        var studentsData = {
          date: st1[0].split(" ")[0],
          className: className1,
          courseId: courseId1,
          maxDur: 100,
          thresholdMins: thresholdMins1,
          arrOfStudents: [],
        };

        const csvFilePath = `./public/${fileName}`;
        csv()
          .fromFile(csvFilePath)
          .then((jsonObj) => {
            // const maxDur = jsonObj[jsonObj.length -1].Duration;
            // console.log("MAX DUR");
            // console.log(maxDur);
            const time22 = jsonObj[jsonObj.length - 1].Duration;
            var time33 = 0;
            if (time22.includes("hr")) {
              const time44 = Number(time22.split("hr")[0]);
              time33 = time33 + time44 * 60;
              const time55 = time22.split("hr")[1];
              const time66 = Number(time55.split("min")[0]);
              time33 = time33 + time66;
            } else if (time22.includes("min")) {
              const time77 = Number(time22.split("min")[0]);
              time33 = time33 + time77;
            } else {
              time33 = 0;
            }
            const maxDur = time33;
            studentsData.maxDur = maxDur;

            for (let x = 0; x < jsonObj.length; x++) {
              const firstName1 = jsonObj[x]["First name"];
              const lastName1 = jsonObj[x]["Last name"];
              const fullName = firstName1 + " " + lastName1;
              studentsData.arrOfStudents.push({
                name: fullName,
                firstName: firstName1,
                lastName: lastName1,
                email: jsonObj[x].Email,
                duration: jsonObj[x].Duration,
              });
            }
            //console.log(studentsData);
            everyClass.create(studentsData);
            
          });
      });
      return res.status(200).json({ msg: "CSV file uploaded" });
    //return res.status(400).json({ msg: "CSV file not uploaded" });
    //console.log(st2[st2.length -1]);

    //const jsonArray = await csv().fromFile(csvFilePath);
  } else if (exten === "sbv") {
    const sbvFilePath = `./public/${fileName}`;
    var content = fs.readFileSync(sbvFilePath, "utf8").toString();
    const content1 = content.split("\n");
    // console.log(content1);

    var arr1 = [];
    for (let x = 0; x < content1.length; x++) {
      var ch = content1[x][0];
      if (ch) {
        //console.log(ch);
        var asci = ch.charCodeAt(0);
        if (asci > 64) {
          //arr1.push(content1[x]);

          if (content1[x].includes(":")) {
            const name1 = content1[x].split(":")[0];
            const mssg = content1[x].split(":")[1];
            let count = 0;
            for (let y = 0; y < arr1.length; y++) {
              if (arr1[y].name === name1) {
                count++;
                arr1[y].comments = arr1[y].comments + 1;
              }
            }
            if (count == 0) {
              arr1.push({ name: name1, comments: 1 });
            }
          }
        }
      }
    }
    console.log(arr1);

    //var options = { verbose: true };
    //var captions = subsrt.parse(content, options);
    //  var sbv = subsrt.convert(content, { format: "json" });
    // const text = captions[0].content;

    //2022-01-24 15_45 Software Engineering Lab Discussion (7948) - Attendance Report;
    //SDE Lecture (2022-01-08 at 01_30 GMT-8)

    const name2 = fileName.split(".sbv")[0];
    const name3 = name2.replace("(20", "@20");
    const name4 = name3.split(" @")[0];
    const date1 = name3.split("@")[1].split(" ")[0];
    // console.log(name4);
    // console.log(date1);

    completeClass
      .find({ fileNames: { $elemMatch: { $eq: name4 } } })
      .then((classFound1) => {
        var studentsData = {
          date: date1,
          className: classFound1[0].name,
          courseId: classFound1[0].courseId,
          arrOfStudents: arr1,
        };

        everySBV.create(studentsData);
      });

    console.log("Hello SBV FILE uploaded");
    return res.json({ msg: "CSV file uploaded" });
  }
});

Router.get("/deleteEveryClass/:courseId/:fileId", async (req, res, next) => {
  try {
    console.log("API is called");
    console.log(req.params.courseId, req.params.fileId);
    completeClass
      .findOne({ courseId: req.params.courseId })
      .then((classFound) => {
        everyClass.findById(req.params.fileId).then((fileFound) => {
          console.log(classFound);
          console.log(fileFound);

          var maxDur1 = 0;

          for (let x = 0; x < fileFound.arrOfStudents.length; x++) {
            for (let y = 0; y < classFound.StudentsData.length; y++) {
              if (x == fileFound.arrOfStudents.length - 1) {
                const time22 = fileFound.arrOfStudents[x].duration;
                var time33 = 0;
                if (time22.includes("hr")) {
                  const time44 = Number(time22.split("hr")[0]);
                  time33 = time33 + time44 * 60;
                  const time55 = time22.split("hr")[1];
                  const time66 = Number(time55.split("min")[0]);
                  time33 = time33 + time66;
                } else if (time22.includes("min")) {
                  const time77 = Number(time22.split("min")[0]);
                  time33 = time33 + time77;
                } else {
                  time33 = 0;
                }

                maxDur1 = time33;
              }

              if (
                fileFound.arrOfStudents[x].email ===
                classFound.StudentsData[y].email
              ) {
                const time2 = fileFound.arrOfStudents[x].duration;
                var time3 = 0;
                if (time2.includes("hr")) {
                  const time4 = Number(time2.split("hr")[0]);
                  time3 = time3 + time4 * 60;
                  const time5 = time2.split("hr")[1];
                  const time6 = Number(time5.split("min")[0]);
                  time3 = time3 + time6;
                } else if (time2.includes("min")) {
                  const time7 = Number(time2.split("min")[0]);
                  time3 = time3 + time7;
                } else {
                  time3 = 0;
                }
                if (time3 > fileFound.maxDur) {
                  time3 = fileFound.maxDur;
                }

                classFound.StudentsData[y].duration =
                  classFound.StudentsData[y].duration - time3;
                if (time3 >= classFound.cutOffMins) {
                  classFound.StudentsData[y].classesAttended =
                    classFound.StudentsData[y].classesAttended - 1;
                }
              }
            }
          }
          classFound.totalClasses = classFound.totalClasses - 1;
          classFound.totalDuration = classFound.totalDuration - maxDur1;
          classFound.uploadNames = classFound.uploadNames.filter(
            (item) => item.fileId !== req.params.fileId
          );
          // classFound
          completeClass.findByIdAndUpdate(
            classFound._id,
            {
              totalClasses: classFound.totalClasses,
              totalDuration: classFound.totalDuration,
              StudentsData: classFound.StudentsData,
              uploadNames: classFound.uploadNames,
            },
            function (err, docs) {
              if (err) {
                console.log("Error happened");
              } else {
                console.log("success");
                res.json({ msg: "success", status: 200 });
              }
            }
          );
        });
      });
  } catch (error) {
    next(error);
  }
});

Router.get("/deleteEveryClassSbv/:courseId/:fileId", async (req, res, next) => {
  try {
    console.log("API is called");
    console.log(req.params.courseId, req.params.fileId);
    completeClass
      .findOne({ courseId: req.params.courseId })
      .then((classFound) => {
        everySBV.findById(req.params.fileId).then((fileFound) => {
          console.log(classFound);
          console.log(fileFound);

          //var maxDur1 = 0;

          for (let x = 0; x < fileFound.arrOfStudents.length; x++) {
            for (let y = 0; y < classFound.StudentsData.length; y++) {
              // if (x == fileFound.arrOfStudents.length - 1) {
              //   const time22 = fileFound.arrOfStudents[x].duration;
              //   var time33 = 0;
              //   if (time22.includes("hr")) {
              //     const time44 = Number(time22.split("hr")[0]);
              //     time33 = time33 + time44 * 60;
              //     const time55 = time22.split("hr")[1];
              //     const time66 = Number(time55.split("min")[0]);
              //     time33 = time33 + time66;
              //   } else if (time22.includes("min")) {
              //     const time77 = Number(time22.split("min")[0]);
              //     time33 = time33 + time77;
              //   } else {
              //     time33 = 0;
              //   }

              //   maxDur1 = time33;
              // }

              if (
                fileFound.arrOfStudents[x].name ===
                classFound.StudentsData[y].name
              ) {
                // const time2 = fileFound.arrOfStudents[x].duration;
                // var time3 = 0;
                // if (time2.includes("hr")) {
                //   const time4 = Number(time2.split("hr")[0]);
                //   time3 = time3 + time4 * 60;
                //   const time5 = time2.split("hr")[1];
                //   const time6 = Number(time5.split("min")[0]);
                //   time3 = time3 + time6;
                // } else if (time2.includes("min")) {
                //   const time7 = Number(time2.split("min")[0]);
                //   time3 = time3 + time7;
                // } else {
                //   time3 = 0;
                // }

                classFound.StudentsData[y].comments =
                  classFound.StudentsData[y].comments -
                  fileFound.arrOfStudents[x].comments;
                // if (time3 >= classFound.cutOffMins) {
                //   classFound.StudentsData[y].classesAttended =
                //     classFound.StudentsData[y].classesAttended - 1;
                // }
              }
            }
          }
          // classFound.totalClasses = classFound.totalClasses - 1;
          // classFound.totalDuration = classFound.totalDuration - maxDur1;
          classFound.uploadNames = classFound.uploadNames.filter(
            (item) => item.fileId !== req.params.fileId
          );
          // classFound
          completeClass.findByIdAndUpdate(
            classFound._id,
            {
              //totalClasses: classFound.totalClasses,
              //totalDuration: classFound.totalDuration,
              StudentsData: classFound.StudentsData,
              uploadNames: classFound.uploadNames,
            },
            function (err, docs) {
              if (err) {
                console.log("Error happened");
              } else {
                console.log("success");
                everySBV.findByIdAndDelete(req.params.fileId);
                res.json({ msg: "success", status: 200 });
              }
            }
          );
        });
      });
  } catch (error) {
    next(error);
  }
});
module.exports = Router;
