const express = require("express");
const Router = express.Router();
const multer = require('multer');
//const csv = require('csv-parser');

const csv = require("csvtojson");
const fs = require('fs');
const { resourceLimits } = require("worker_threads");
const everyClass = require("./../models/EveryClass");

const storage = multer.diskStorage({
    destination: (req , file , cb) =>{
        cb(null , 'public');
    },
    filename:(req , file ,cb) =>{
        cb(null ,file.originalname)
    }
})

const upload = multer({storage}).single('file');

Router.post("/upload", async (req, res, next) => {
  try {
    upload(req,res,(err)=>{
        if(err){
            return res.status(500).json(err)
        }

        return(res.status(200).send(req.file));
    })
    //res.send("success");
    
  } catch (error) {
    next(error);
  }
});

Router.post("/addClass" , async (req, res , next) =>{



    var results = [];
    let results1 = [];
    const {fileName} = req.body;
    console.log(fileName);

    const st1 = fileName.split(" Lecture")[0];
    // const st2 = st1[0]
    const st2 = st1.split(" ");
    const st3 = st2[st2.length - 1];

    console.log(st2[st2.length -1]);

    var studentsData = {
        date: st1.split(" ")[0],
        className: st3,
        arrOfStudents: []

    }

    var ranObj = {
        // name: "a",
        // email: "a",
        // duration: "a",
    }

    // const apple = fs.readFileSync(`./public/${fileName}`);
    // console.log(apple);
    

    const csvFilePath = `./public/${fileName}`;
    csv()
      .fromFile(csvFilePath)
      .then((jsonObj) => {
        for(let x = 0 ; x<jsonObj.length ; x++ )
        {
            //console.log(x);
            // ranObj.name = jsonObj[x]["First name"];
            // ranObj.email = jsonObj[x].Email;
            // ranObj.duration = jsonObj[x].Duration;
            studentsData.arrOfStudents.push({ name: jsonObj[x]["First name"] , email :jsonObj[x].Email , duration: jsonObj[x].Duration });
        }
        //console.log(studentsData);
        everyClass.create(studentsData);

      });

    const jsonArray = await csv().fromFile(csvFilePath);



    // const okFunc =  async () => {    
    //     fs.createReadStream(`./public/${fileName}`)
    //     .pipe(csv({}))
    //     .on('data' , (data) => {results.push(data)})
    //     //.on('data' , (data) => {
    //     //     // {studentsData.arrOfStudents.push({
    //     //     //         name: data.name,
    //     //     //         email: data.email,
    //     //     //         duration: data.duration,
    //     //     //     });
    //     //         // ranObj.name = data.name;
    //             // console.log(data.Email);
    //             // console.log(data.Duration);
    //             // ranObj.email = data.Email;
    //             // ranObj.duration = data.Duration;
    //             //results.push({"email" : data.Email , "duration" : data.Email});
    //     //})
    //     .on('end' , () =>{
    //         //console.log(results);
    //         //console.log(results[0]["First name"]);
    //         // for(let x = 0 ; x<results.length ; x++)
    //         // {
    //         //     ranObj.name = results[x]["First name"];
    //         //     ranObj.email = results[x].Email;
    //         //     ranObj.duration = results[x].Duration;

    //         //     results1.push(ranObj);
    //         //     // studentsData.arrOfStudents.push(ranObj);
    //         //     // console.log(studentsData.arrOfStudents);
    //         // }
    //         // console.log(studentsData);
    //         //everyClass.create(studentsData);

    //     })
    // }
    
    // await okFunc().then(() =>{{
    //     //console.log(studentsData);
    //     console.log(results);
    //     //everyClass.create(studentsData);
    // }})
    //console.log(studentsData);
})


module.exports = Router;