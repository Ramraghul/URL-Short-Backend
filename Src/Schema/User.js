//Require
const mongoose = require('mongoose');

//Schema
const Users = new mongoose.Schema({
    Username :{
        type: String,
        required: true,
        collection: String
    },
    Email :{
        type: String,
        required: true,
        
    },
    Password:{
        type: String,
        required : true
    },
    isActive:{
        type: String,
        default :'inActive'
    }

},{timestamps : true})

//Export;
module.exports = mongoose.model('Users',Users,"User_Data");

