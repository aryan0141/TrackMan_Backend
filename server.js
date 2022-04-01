const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const mail = require("./mailing/mail_server");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connections successful");
  })
  .catch((err) => {
    mail.mailfunc("DB Connection Error", err.toString());
    console.log(err);
  });

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
