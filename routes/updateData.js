const express = require("express");
const Router = express.Router();
const StopWords = require("./../models/StopWords.js");
const axios = require("axios");
const mail = require("./../mailing/mail_server");
const completeClassv2 = require("./../models/CompleteClassv2");
const everyClassv2 = require("./../models/EveryClassv2");
const everySBVv2 = require("./../models/EverySBVv2.js");
const { auth } = require("../utils/authMiddleware");

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}

Router.get("/updateData/:className/:teacher", auth, async (req, res, next) => {
    console.log("updating data api called");
  try {
    const className2 = req.params.className;
    const teacher = req.params.teacher;

    console.log(className2 , teacher);
        completeClassv2
           .find({ name: className2, teacher: teacher })
           .then(async (classFound1) => {
                // console.log(classFound1[0]);
             let classFound = classFound1[0];
             classFound.totalDuration = 0;
             classFound.totalClasses = 0;
             classFound.uploadNames = [];
             classFound.StudentsData = [];

             const allCSV = await everyClassv2.find({
               className: className2,
               teacher: teacher,
             });

             const allSBV = await everySBVv2.find({
               className: className2,
               teacher: teacher,
             });

             console.log(allCSV);
             allCSV.forEach(async (classFound2) => {
               const arrOfStudents = classFound2.arrOfStudents;
               const fileID1 = classFound2._id;
               const date_1 = classFound2.date;
               const fileName = classFound2.fileName;

               var maxDur = 0;
               var maxDur1 = 0;
               const x1 = arrOfStudents.length - 1;
               const time22 = arrOfStudents[x1].duration;
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

               for (let x = 0; x < arrOfStudents.length; x++) {
                 let count = 0;

                 for (let y = 0; y < classFound.StudentsData.length; y++) {
                   if (
                     classFound.StudentsData[y].email == arrOfStudents[x].email
                   ) {
                     count++;
                     const time2 = arrOfStudents[x].duration;
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

                     if (time3 > maxDur) {
                       maxDur = time3;
                     }
                     if (time3 > maxDur1) {
                       time3 = maxDur1;
                     }
                     // console.log(classFound.cutOffMins);
                     classFound.StudentsData[y].duration =
                       classFound.StudentsData[y].duration + time3;
                     if (time3 >= classFound.cutOffMins) {
                       classFound.StudentsData[y].classesAttended =
                         classFound.StudentsData[y].classesAttended + 1;
                     } else {
                       classFound.StudentsData[y].duration =
                         classFound.StudentsData[y].duration + time3;
                     }
                   }
                 }
                 if (count === 0) {
                   const time2 = arrOfStudents[x].duration;
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
                   if (time3 > maxDur1) {
                     time3 = maxDur1;
                   }
                   let obj = {
                     email: arrOfStudents[x].email,
                     duration: time3,
                     comments: 0,
                     classesAttended: 1,
                     name: arrOfStudents[x].name,
                   };

                   classFound.StudentsData = [...classFound.StudentsData, obj];
                 }
               }
            classFound.totalClasses++;
            classFound.totalDuration = classFound.totalDuration + maxDur1;
               //const upload_time1 = new Date().toISOString();
               let today = new Date();

               let month = today.getMonth() + 1;
               let year = today.getFullYear();
               let date = today.getDate();
               let current_date = `${month}/${date}/${year}`;
               // output.innerText = current_date;
               let hours = addZero(today.getHours());
               let minutes = addZero(today.getMinutes());
               let seconds = addZero(today.getSeconds());
               let current_time = `${hours}:${minutes}:${seconds}`;
               //output.innerText = current_time;

               const upload_time1 = current_date + " " + current_time;

               //console.log(upload_time1);
               const obj11 = {
                 fileId: fileID1,
                 date: date_1,
                 filename: fileName,
                 uploadTime: upload_time1,
                 FileType: "csv",
               };

               classFound.uploadNames = [...classFound.uploadNames, obj11];

               console.log(classFound);
             });

             
             allSBV.forEach(async (classFound2) => {   
                                const arrOfStudents = classFound2.arrOfStudents;
                                const fileID1 = classFound2._id;
                                const date11 = classFound2.date;
                                const fileName = classFound2.fileName;    

                      for (let x = 0; x < arrOfStudents.length; x++) {
                        let count = 0;
                        for ( let y = 0; y < classFound.StudentsData.length; y++) {
                          if (classFound.StudentsData[y].name == arrOfStudents[x].name) {
                            count++;
                            classFound.StudentsData[y].comments = classFound.StudentsData[y].comments + arrOfStudents[x].comments;

                          }
                        }
                        if (count == 0) {

                        }
                      }
                      let today = new Date();

                      let month = today.getMonth() + 1;
                      let year = today.getFullYear();
                      let date = today.getDate();
                      let current_date = `${month}/${date}/${year}`;
                      // output.innerText = current_date;
                      let hours = addZero(today.getHours());
                      let minutes = addZero(today.getMinutes());
                      let seconds = addZero(today.getSeconds());
                      let current_time = `${hours}:${minutes}:${seconds}`;
                      //output.innerText = current_time;

                      const upload_time1 = current_date + " " + current_time;

                      const obj11 = {
                        fileId: fileID1,
                        date: date11,
                        filename: fileName,
                        uploadTime: upload_time1,
                        FileType: "sbv",
                      };
                      console.log(obj11);
                      classFound.uploadNames = [...classFound.uploadNames,obj11];
            })


             await completeClassv2.findByIdAndUpdate( classFound._id,
               {
                 totalClasses: classFound.totalClasses ,
                 totalDuration: classFound.totalDuration ,
                 StudentsData: classFound.StudentsData,
                 uploadNames: classFound.uploadNames,
               },
               { new: true },
               function (err, docs) {
                 if (err) {
                   console.log("Error happened");
                 } else {
                   console.log("success");
                 }
               }
             );
        
        

        });

    res.status(200);
  } catch (error) {
    mail.mailfunc("Error in /addStopWords", error.toString());
    next(error);
  }
});

module.exports = Router;
