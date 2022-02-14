const express = require("express");
const Router = express.Router();
const completeClass = require("./../models/CompleteClass");


Router.post("/addFileName", async (req, res, next) => {
    const {filename} = req.body;
    console.log(filename);


    completeClass.find({ fileNames: { $elemMatch: { $eq: filename.name } } }).then((classFound1) => {
        if(classFound1[0] == null)
        {
            console.log("classfound is null");
            completeClass.findOne({ name: filename.classname }).then((classFound2) => {
                //console.log(classFound2);
                classFound2.fileNames.push(filename.name);
                completeClass.findByIdAndUpdate(classFound2._id,{
                    fileNames: classFound2.fileNames,
                },
                function (err, docs) {
                if (err) {
                    console.log("Error happened");
                    } else {
                      res.json({msg: "success" , status: 200});
                      console.log("success");
                    }
                  }
                );
            });
            
        }else{
            console.log("Filename is already registered");
            res.json({msg: "Already registered" , status: 400});

        }
          
    });
})

Router.post("/deleteFileName", async (req, res, next) => {
  const { filename } = req.body;
  console.log(filename);

  completeClass.find({ fileNames: { $elemMatch: { $eq: filename.name } } }).then((classFound1) => {
      if (classFound1[0] == null) {
        console.log("classfound is null");
        //res.status(400);
        res.json({ msg: "Already registered", status: 400 });

      } else {

        console.log("Filename is already registered");


        completeClass.findOne({ name: filename.classname }).then((classFound2) => {
            //console.log(classFound2);
            //classFound2.fileNames.push(filename.name);
            classFound2.fileNames = classFound2.fileNames.filter(
              (v) => v !== filename.name
            );
            completeClass.findByIdAndUpdate(
                classFound2._id,
                {
                fileNames: classFound2.fileNames,
                },
                function (err, docs) {
                if (err) {
                  res.json({ msg: "Already registered", status: 400 });
                    console.log("Error happened");
                } else {
                  res.json({ msg: "success", status: 200 });
                  //res.status(200);
                  console.log("successfully deleted");
                }
            }
            );
        });


        res.status(200);
      }
    });
});

module.exports = Router;