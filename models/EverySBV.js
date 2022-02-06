const mongoose = require("mongoose");
const validator = require("validator");
const completeClass = require("./../models/CompleteClass");

const everySBVSchema = new mongoose.Schema({
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
  arrOfStudents: [{ name: String,  comments: Number }],
});

everySBVSchema.statics.calcAverageRatings = async function (className,arrOfStudents) {
  completeClass.findOne({ name: className }).then((classFound) => {
    // console.log(classFound);

    // console.log(arrOfStudents);

    var maxDur = 0;

    for (let x = 0; x < arrOfStudents.length; x++) {
      for (let y = 0; y < classFound.StudentsData.length; y++) {
        if (classFound.StudentsData[y].name == arrOfStudents[x].name) {
 
          //console.log(time3);
          classFound.StudentsData[y].comments =
            classFound.StudentsData[y].comments + arrOfStudents[x].comments;
        //   classFound.StudentsData[y].classesAttended =
        //     classFound.StudentsData[y].classesAttended + 1;
          //obj.duration = obj.duration + time3;
          //classFound.StudentsData[i] = obj;
        }
      }
    }
    //classFound.totalClasses = classFound.totalDuration + 1;
    //classFound.totalDuration = classFound.totalDuration + maxDur;
    //console.log(" HI" , classFound.id);
    // console.log(classFound._id);
    // console.log(classFound);

    completeClass.findByIdAndUpdate(
      classFound._id,
      {
        //totalClasses: classFound.totalClasses,
        //totalDuration: classFound.totalDuration,
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

everySBVSchema.post("save", function () {
  //This points to current class that happened
  this.constructor.calcAverageRatings(this.className, this.arrOfStudents);
  //	next();
});

const EverySBV = mongoose.model("EverySBV", everySBVSchema);

module.exports = EverySBV;
