var nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

function mailfunc(subject, errormessage){
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAILID,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    var mailOptions = {
      from: process.env.EMAILID,
      to: "garg.10@iitj.ac.in",
      subject: subject,
      text: errormessage,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Error Email sent: " + info.response);
      }
   });
  }
  exports.mailfunc= mailfunc;
