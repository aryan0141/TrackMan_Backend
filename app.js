const express = require('express');
const path = require("path");
const userRouter = require("./routes/userRoutes");
const teacherRouter = require("./routes/teachersClassRoutes")

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.use("/api/users", userRouter);
app.use("/api/teachers", teacherRouter);

module.exports = app;

// const port = 4000
// app.listen(port , ()=>{
//     console.log("Listening");
// })