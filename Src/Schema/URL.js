//Require;
const mongoose = require('mongoose')

//Schema;
const URL = new mongoose.Schema({
    origUrl: {
        type: String,
        required: true,
        collection: String
    },
    shortUrl: {
        type: String,
        required: true
    },
    short:{
        type:String,
        require:true
    },
    count: {
        type: Number,
        required: true,
        default: 0
    }
},{timestamps : true});

module.exports = mongoose.model("URL_Short", URL, "URL_Short")

