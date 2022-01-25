const mongoose = require("mongoose");
const validator = require("validator");

const CompleteClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },

    courseId: {

        type: String,
        require: true,
        lowercase: true,
    },

    totalDuration: {
        type: Number,
        default: 0,
    },
    totalClasses :{
        type: Number,
        default: 0
    },

    StudentsData: [{ email: String, duration: Number, classesAttended: { type: Number, default: 0} , name: String,}]

});

const CompleteClass = mongoose.model("CompleteClass", CompleteClassSchema);

module.exports = CompleteClass;