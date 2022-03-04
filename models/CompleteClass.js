const mongoose = require("mongoose");
const validator = require("validator");

const CompleteClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // lowercase: true,
  },
  fileNames: [String],
  uploadNames: [
    {
      fileId: String,
      date: String,
      filename: String,
      uploadTime: String,
      FileType: String,
    },
  ],

  courseId: {
    type: String,
    require: true,
    lowercase: true,
  },

  totalDuration: {
    type: Number,
    default: 0,
  },

  cutOffMins: {
    type: Number,
    default: 1,
  },
  totalClasses: {
    type: Number,
    default: 0,
  },

  StudentsData: [
    {
      email: String,
      duration: Number,
      comments: { type: Number, default: 0 },
      classesAttended: { type: Number, default: 0 },
      name: String,
    },
  ],
});

const CompleteClass = mongoose.model("CompleteClass", CompleteClassSchema);

module.exports = CompleteClass;