//Required And connections;
const mongoose = require('mongoose');
require('dotenv').config();
let Link = process.env.Link

mongoose.connect(`${Link}`,{ useNewUrlParser: true,useUnifiedTopology: true}).then(() => {
    console.log("DB Connected Done");
}).catch((error) => {
    console.log(error);
})