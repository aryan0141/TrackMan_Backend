const mongoose = require("mongoose");
// const validator = require("validator");

const stopWordsSchema = new mongoose.Schema({
  wordsStop: {
    type: String, 
    unique: true },
});

const StopWords = mongoose.model("StopWords", stopWordsSchema);

module.exports = StopWords;
