const express = require("express");
const Router = express.Router();
const completeClass = require("./../models/CompleteClass");


Router.post("/addFileName", async (req, res, next) => {
  try{
    const {filename} = req.body;
    // console.log(filename);


    completeClass.find({ fileNames: { $elemMatch: { $eq: filename.name } } }).then((classFound1) => {
        if(classFound1[0] == null)
        {
            // console.log("classfound is null");
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
                      // console.log("success");
                    }
                  }
                );
            });
            
        }else{
            //console.log("Filename is already registered");
            res.json({msg: "Already registered" , status: 400});

        }
          
    });
  }catch(error){
    next(error);
  }
})

Router.post("/deleteFileName", async (req, res, next) => {
  try{
  const { filename } = req.body;
  //console.log(filename);

  completeClass.find({ fileNames: { $elemMatch: { $eq: filename.name } } }).then((classFound1) => {
      if (classFound1[0] == null) {
        //console.log("classfound is null");
        //res.status(400);
        res.json({ msg: "Already registered", status: 400 });

      } else {

        //console.log("Filename is already registered");


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
                  //console.log("successfully deleted");
                }
            }
            );
        });


        res.status(200);
      }
    });
  }catch(error){
    next(error);
  }
});

Router.post("/updateCuttOffMin" , async(req , res , next) =>{
  try{
    const { cuttOffMin1 } = req.body;

    //console.log(cuttOffMin1);
    const cuttOffMin = Number(cuttOffMin1.cuttOffMin);
    const className1 = cuttOffMin1.className1;


    completeClass.findOne( {name: className1}).then((resp) =>{
      completeClass.findByIdAndUpdate(
        resp._id,
        {
          cutOffMins: cuttOffMin,
          // totalClasses: classFound.totalClasses,
          // totalDuration: classFound.totalDuration,
          // StudentsData: classFound.StudentsData,
        },
        function (err, docs) {
          if (err) {
            res.json({ msg: "Already registered", status: 400 });
            console.log("Error happened");
          } else {
            res.json({ msg: "success", status: 200 });
            console.log("success");
          }
        }
      );
    })
  }catch(error){
    next(error);
  }

    //console.log(cuttOffMin);
});


Router.post("/updateWeightageArr", async (req, res, next) => {
  //console.log("API called");
  try{
  const { weightAgeDoc } = req.body;
  const w1 = weightAgeDoc.w1;
  const w2 = weightAgeDoc.w2;
  const w3 = weightAgeDoc.w3;
  const className2 = weightAgeDoc.className2; 
  const arr23 = [w1 , w2 , w3];

  completeClass.findOne({ name: className2 }).then((classFound2) =>{
    completeClass.findByIdAndUpdate(
      classFound2._id,
      {
        weightAge: arr23,
      },
      function (err, docs) {
        if (err) {
          res.json({ msg: "Error happened", status: 400 });
          //console.log("Error happened");
        } else {
          res.json({ msg: "success", status: 200 });
          //console.log("success on weightAge");
        }
      }
    );

  })
  }catch(error){
    next(error);
  }

});



module.exports = Router;