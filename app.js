const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const teacherRouter = require("./routes/teachersClassRoutes");
const filenames = require("./routes/fileName");
const StopWords = require("./routes/StopWordsRoutes.js");
const uploadFiles = require("./routes/uploadFiles");
const StudentsData = require("./routes/updateData");

const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// app.use("/api/users", userRouter);
app.use("/", require("./routes/userRoutesv2"));
app.use("/api", require("./routes/classesRoutes"));
app.use("/api/uploadFiles", uploadFiles);

app.use("/api/uploadDoc", uploadRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/fileNames", filenames);
app.use("/api/stopWords", StopWords);
app.use("/api/studentsData" , StudentsData);

module.exports = app;

// const port = 4000
// app.listen(port , ()=>{
//     console.log("Listening");
// })
