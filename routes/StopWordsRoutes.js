const express = require("express");
const Router = express.Router();
const StopWords = require("./../models/StopWords.js");
const axios = require("axios");


Router.get("/addStopWords/:stopWords", async (req, res, next) => {
  try {
      console.log("Done");
    const stopWords1 = req.params.stopWords;

    StopWords.create({ wordsStop: stopWords1 });
    console.log("Done");
    return res.status(200);

  } catch (error) {
    next(error);
  }
});

module.exports = Router;
