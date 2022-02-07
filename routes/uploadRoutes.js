const express = require("express");
const Router = express.Router();
const multer = require('multer');
//const csv = require('csv-parser');
const fs = require("fs");
const csv = require("csvtojson");
var subsrt = require("subsrt");
const { resourceLimits } = require("worker_threads");
const everyClass = require("./../models/EveryClass");
const everySBV = require("./../models/EverySBV");


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
    console.log("hi");
    //console.log(req.file);
    upload(req,res,(err)=>{
        if(err){
            return res.status(500).json(err)
        }
        if (req.file.mimetype === 'application/octet-stream' || req.file.mimetype ==='text/csv')
        {
          console.log(req.file);
          return(res.status(200).send(req.file));
        }else{
          return(res.status(400));
        }
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
    //console.log(fileName);
    const ext = fileName.split('.');
    const exten = ext[ext.length -1];

    if(exten==='csv')
    {
      const st1 = fileName.split(" Lecture")[0];
      // const st2 = st1[0]
      const st2 = st1.split(" ");
      const st3 = st2[st2.length - 1];

      //console.log(st2[st2.length -1]);

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
              const firstName1 = jsonObj[x]["First name"];;
              const lastName1 = jsonObj[x]["Last name"];
              const fullName = firstName1+" "+lastName1;
              studentsData.arrOfStudents.push({ name: fullName , firstName: firstName1, lastName: lastName1, email :jsonObj[x].Email , duration: jsonObj[x].Duration });
          }
          //console.log(studentsData);
          everyClass.create(studentsData);

        });

      const jsonArray = await csv().fromFile(csvFilePath);
    }else if(exten === 'sbv')
    {
      const sbvFilePath = `./public/${fileName}`;
      var content = fs.readFileSync(sbvFilePath, "utf8").toString();
      const content1 = content.split("\n");
      // console.log(content1);
      // console.log("PA");

      var arr1 = [];
      for (let x = 0; x < content1.length; x++) {
        var ch = content1[x][0];
        if (ch) {
          //console.log(ch);
          var asci = ch.charCodeAt(0);
          if (asci > 64) {
            //arr1.push(content1[x]);
            
            if(content1[x].includes(":"))
            {
            const name1 = content1[x].split(":")[0];
            const mssg = content1[x].split(":")[1];
            let count = 0;
            for(let y = 0 ; y<arr1.length ; y++)
            {
              if(arr1[y].name === name1)
              {
                count++;
                arr1[y].comments = arr1[y].comments+1;
              }
            }
            if(count==0)
            {
              arr1.push({ name: name1 , comments: 1});
            }
            }
          }
        }
      }
      console.log(arr1);

      //var options = { verbose: true };
      //var captions = subsrt.parse(content, options);
      //  var sbv = subsrt.convert(content, { format: "json" });
      // const text = captions[0].content;

      //2022-01-24 15_45 Software Engineering Lab Discussion (7948) - Attendance Report;
      //SDE Lecture (2022-01-08 at 01_30 GMT-8)

      const name2 = fileName.split('.sbv')[0];
      const name3 = name2.replace('(20' , '@20');
      const name4 = name3.split(" @")[0];
      const date1 = name3.split("@")[1].split(" ")[0];
      console.log(name4);
      console.log(date1);


      //console.log(st2[st2.length -1]);

      var studentsData = {
        date: date1,
        className: name4,
        arrOfStudents: arr1,
      };
      
      everySBV.create(studentsData);
      // var ranObj = {
      //   // name: "a",
      //   // email: "a",
      //   // duration: "a",
      // };

      console.log("Hello SBV FILE uploaded");
    }



})


module.exports = Router;