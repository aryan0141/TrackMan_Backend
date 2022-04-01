const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  isActivated: {
    type: Boolean,
    required: true,
    default: false,
  },
  //   photo: {
  //     type: String,
  //     default: "default.jpg",
  //   },

  //   role: {
  //     type: String,
  //     enum: ["user", "seller", "admin"],
  //     default: "user",
  //   },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
