const mongoose = require("mongoose");
const validator = require("validator");
const completeClass = require("./../models/CompleteClass");

const everyClassSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },

  className: {
    type: String,
    required: true,
    // unique: true,
    lowercase: true,
  },
  arrOfStudents: [{name: String , firstName: String , lastName: String, email: String , duration: String}]

});


everyClassSchema.statics.calcAverageRatings = async function (className , arrOfStudents) {

  //completeClass.findOne({name: className}).then( (classFound) =>{
  completeClass.find({ fileNames: { $elemMatch: { $eq: className } } }).then((classFound1) => {
      //console.log(classFound[0]);
      const classFound = classFound1[0];
      //console.log(classFound.StudentsData);

      var maxDur = 0;

      for (let x = 0; x < arrOfStudents.length; x++) {
        for (let y = 0; y < classFound.StudentsData.length; y++) {
          if (classFound.StudentsData[y].email == arrOfStudents[x].email) {
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
            //console.log(time3);
            classFound.StudentsData[y].duration =
              classFound.StudentsData[y].duration + time3;
            classFound.StudentsData[y].classesAttended =
              classFound.StudentsData[y].classesAttended + 1;
            //obj.duration = obj.duration + time3;
            //classFound.StudentsData[i] = obj;
          }
        }
      }
      classFound.totalClasses = classFound.totalClasses + 1;
      classFound.totalDuration = classFound.totalDuration + maxDur;
      //console.log(" HI" , classFound.id);
      // console.log(classFound._id);
      // console.log(classFound);

      completeClass.findByIdAndUpdate(
        classFound._id,
        {
          totalClasses: classFound.totalClasses,
          totalDuration: classFound.totalDuration,
          StudentsData: classFound.StudentsData,
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

everyClassSchema.post("save", function () {
  //This points to current class that happened
  this.constructor.calcAverageRatings(this.className , this.arrOfStudents);
  //	next();
});

const EveryClass = mongoose.model("EveryClass", everyClassSchema);

module.exports = EveryClass;

