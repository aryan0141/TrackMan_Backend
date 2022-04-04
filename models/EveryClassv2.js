const mongoose = require("mongoose");
const validator = require("validator");
const completeClassv2 = require("./../models/CompleteClassv2");

const everyClassv2Schema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },

  className: {
    type: String,
    required: true,
    // unique: true,
    // lowercase: true,
  },
  teacher:{
      type: String,
  },
  maxDur: {
    type: Number,
  },
  thresholdMins: {
    type: Number,
  },
  arrOfStudents: [
    {
      name: String,
      firstName: String,
      lastName: String,
      email: String,
      duration: String,
    },
  ],
  fileName: {
    type: String,
  },
});

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}

everyClassv2Schema.statics.calcAverageRatings = async function ( className,teacher,arrOfStudents, fileID1,date_1, fileName) {
  console.log(className);
  //completeClass.findOne({name: className}).then( (classFound) =>{
  completeClassv2.find({ fileNames: className , teacher: teacher })
    .then(async (classFound1) => {
      console.log(classFound1[0]);
      const classFound = classFound1[0];
      //console.log(classFound.StudentsData);

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
        // if (x == arrOfStudents.length - 1) {
        //             const time22 = arrOfStudents[x].duration;
        //             var time33 = 0;
        //             if (time22.includes("hr")) {
        //               const time44 = Number(time22.split("hr")[0]);
        //               time33 = time33 + time44 * 60;
        //               const time55 = time22.split("hr")[1];
        //               const time66 = Number(time55.split("min")[0]);
        //               time33 = time33 + time66;
        //             } else if (time22.includes("min")) {
        //               const time77 = Number(time22.split("min")[0]);
        //               time33 = time33 + time77;
        //             } else {
        //               time33 = 0;
        //             }

        //   maxDur1 = time33;
        // }

        for (let y = 0; y < classFound.StudentsData.length; y++) {
          if (classFound.StudentsData[y].email == arrOfStudents[x].email) {
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
            console.log(classFound.cutOffMins);
            classFound.StudentsData[y].duration =
              classFound.StudentsData[y].duration + time3;
            if (time3 >= classFound.cutOffMins) {
              classFound.StudentsData[y].classesAttended =
                classFound.StudentsData[y].classesAttended + 1;
            } else {
              classFound.StudentsData[y].duration =
                classFound.StudentsData[y].duration + time3;
            }
            //obj.duration = obj.duration + time3;
            //classFound.StudentsData[i] = obj;
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
      console.log(maxDur1);
      classFound.totalClasses = classFound.totalClasses + 1;
      //classFound.totalDuration = classFound.totalDuration + maxDur;
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
      //console.log(obj11);
      classFound.uploadNames = [...classFound.uploadNames, obj11];
      //console.log(" HI" , classFound.id);
      // console.log(classFound._id);
      // console.log(classFound);

      await completeClassv2.findByIdAndUpdate(
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
          }
        }
      );
    });
};

everyClassv2Schema.post("save", function () {
  //This points to current class that happened
  this.constructor.calcAverageRatings(
    this.className,
    this.teacher,
    this.arrOfStudents,
    this._id,
    this.date,
    this.fileName
  );
  	next();
});

const EveryClassv2 = mongoose.model("EveryClassv2", everyClassv2Schema);

module.exports = EveryClassv2;
