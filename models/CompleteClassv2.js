const mongoose = require("mongoose");
const validator = require("validator");

const CompleteClassv2Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // lowercase: true,
  },
  teacher: {
      type: String,
      required: true,
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

  totalDuration: {
    type: Number,
    default: 0,
  },

  cutOffMins: {
    type: Number,
    default: 1,
  },
  weightAge: {
    type: [],
    default: [40, 30, 30],
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

const CompleteClassv2 = mongoose.model("CompleteClassv2", CompleteClassv2Schema);

module.exports = CompleteClassv2;
