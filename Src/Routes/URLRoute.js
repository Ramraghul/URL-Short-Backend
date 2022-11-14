//Required;
const Url = require('../Schema/URL');
const express = require('express');
const path = express.Router();
const randomstring = require('randomstring')
require('dotenv').config()

//Conform to work;------------------------------------------------------------------------------------------------(1)
path.post('/Short', (req, res) => {

    //Long to Short 
    const urlId = randomstring.generate({ length: 12, charset: 'alphanumeric' });
    let shortLink = `${process.env.SHORT}/Url/${urlId}`
    req.body.shortUrl = urlId
    req.body.short = shortLink

    //Insert Short Url data
    let data = new Url(req.body);
    data.save().then((result) => {
        res.status(201).send(result.short)
    }).catch((error) => {
        console.log(error);
    })
})


//Find and return original url-------------------------------------------------------------------------------------(2)
path.get('/:Url', (req, res) => {
    try {
        let shortUrl = req.params.Url;
        Url.findOne({ shortUrl: shortUrl }).then((data) => {
            Url.findOneAndUpdate({_id:data.id }, { $inc: { count: 1 } }, { new: true },function(err,result){
                if(err){
                    res.send(err)
                }
                res.redirect(result.origUrl)
            })
        })
    } catch (error) {
        res.status(500).json({ Message: error })
    }
})


//Get all data------------------------------------------------------------------------------------------------------(3)
path.get('/Data/All',(req,res)=>{
    try {
        Url.find().then((data)=>{
            res.status(201).json(data)
        })
    } catch (error) {
        res.status(500).json(error)
    }
})


//Export express Router;
module.exports = path;