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
    // lowercase: true,
  },
  courseId: {
    type: String,
  },
  arrOfStudents: [{ name: String, comments: Number }],
});

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}


everySBVSchema.statics.calcAverageRatings = async function (className,arrOfStudents , fileID1) {
  //find({ fileNames: { $elemMatch: { $eq: className } } });
  //completeClass.findOne({ name: className }).then((classFound) => {
    console.log(className);
    if(className ==="sde lecture"){
      className = "SDE Lecture";
    }
    
  completeClass.find({ fileNames: { $elemMatch: { $eq: className } } }).then((classFound) => {
    console.log("class founded");
      console.log(classFound);

    //  console.log(arrOfStudents);

    var maxDur = 0;

    for (let x = 0; x < arrOfStudents.length; x++) {
      for (let y = 0; y < classFound[0].StudentsData.length; y++) {
        if (classFound[0].StudentsData[y].name == arrOfStudents[x].name) {
 
          //console.log(time3);
          classFound[0].StudentsData[y].comments =
            classFound[0].StudentsData[y].comments + arrOfStudents[x].comments;
        //   classFound.StudentsData[y].classesAttended =
        //     classFound.StudentsData[y].classesAttended + 1;
          //obj.duration = obj.duration + time3;
          //classFound.StudentsData[i] = obj;
        }
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

          //console.log(upload_time1);
          const obj11 = {
            fileId: fileID1,
            date: "coming_soon...",
            filename: "coming_soon...",
            uploadTime: upload_time1,
            FileType: "sbv",
          };
          //console.log(obj11);
          classFound[0].uploadNames = [...classFound[0].uploadNames, obj11];
    //classFound.totalClasses = classFound.totalDuration + 1;
    //classFound.totalDuration = classFound.totalDuration + maxDur;
    //console.log(" HI" , classFound.id);
    // console.log(classFound._id);
    // console.log(classFound);

    completeClass.findByIdAndUpdate(
      classFound[0]._id,
      {
        //totalClasses: classFound.totalClasses,
        //totalDuration: classFound.totalDuration,
        StudentsData: classFound[0].StudentsData,
        uploadNames: classFound[0].uploadNames,
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
  this.constructor.calcAverageRatings(this.className, this.arrOfStudents ,  this._id);
  //	next();
});

const EverySBV = mongoose.model("EverySBV", everySBVSchema);

module.exports = EverySBV;
