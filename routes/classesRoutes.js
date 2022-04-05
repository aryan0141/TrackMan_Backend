const express = require("express");
const Router = express.Router();
const completeClassv2 = require("../models/CompleteClassv2");
const { auth } = require("../utils/authMiddleware");

// @Desc    Creates class
// @Route   /api/createClass
// @Access  Private
Router.post("/createClass", auth, async (req, res, next) => {
  try {
    console.log("route called");
    const { createClass } = req.body;
    const res1 = await completeClassv2.find(
      { name: createClass.courseName, teacher: createClass.teacherName },
      { limit: 1 }
    );
    if (res1.length === 0) {
      var class1 = {
        name: createClass.courseName,
        teacher: createClass.teacherName,
        fileNames: [],
        uploadNames: [],
        totalDuration: 0,
        StudentsData: [],
      };
      class1.fileNames.push(createClass.courseName);
      const response = await completeClassv2.create(class1);
      res.status(200).json(response);
    } else {
      res.status(400).json({ msg: "Coursename/Teachername already exists" });
    }
  } catch (error) {
    console.log(error);
    // mail.mailfunc("Error in /addFileName", error.toString());
    // next(error);
  }
});



// @Desc    Get classes list
// @Route   /api/getClass
// @Access  Private
Router.get("/getClasses", auth, async (req, res, next) => {
  try {

    // console.log(req.user.email);
    const allClasses = await completeClassv2.find({ teacher: req.user.email});
    // console.log(allClasses);
    res.status(200).json(allClasses);
   
  } catch (error) {
    console.log(error);
    // mail.mailfunc("Error in /addFileName", error.toString());
    // next(error);
  }
});

Router.get("/getClass/:className", auth, async (req, res, next) => {
  try {
    console.log(req.user.email);
    const Class = await completeClassv2.findOne({ teacher: req.user.email , name: req.params.className });
    // console.log(Class);
    res.status(200).json(Class);
  } catch (error) {
    console.log(error);
    // mail.mailfunc("Error in /addFileName", error.toString());
    // next(error);
  }
});


module.exports = Router;
