//Required;
require('../Connection/Connection')
require('dotenv').config()
const Users = require('../Schema/User');
const express = require('express');
const Path = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');
let FROM =process.env.EMAIL
let PASSWORD =process.env.PASSWORD
let Secret = process.env.SEC

//Conform to work;------------------------------------------------------------------------------------------------(1)
Path.get('/', (req, res) => {
    res.send('<h1>Never Give Up..!</h1>')
})

//User registration;----------------------------------------------------------------------------------------------(2)
Path.post('/Register', async (req, res) => {
    //Password Hashing;
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.Password, salt)
    req.body.Password = hash

    //Data insert and send link;
    let inward = new Users(req.body);
    inward.save().then((data) => {
        let Active = `${process.env.CONNECTION}/Activate/${data._id}`;
        let To = data.Email;

        //Send a link Via mail;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: FROM,
                pass: PASSWORD
            }
        });

        var mailOptions = {
            from: FROM,
            to: To,
            subject: 'Account activate',
            text: "Click this Link Activate your Account",
            html: `<Link to=${Active} target="_blank">${Active}</Link>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:' + info.response);
            }
        });
        res.json({ Message: "Account Created please Active Account" })
    }).catch((error) => {
        console.log(error);
    })
})

//Account Activation;-------------------------------------------------------------------------------------------------(3)
Path.put('/Activate/:id', async (req, res) => {
    try {
        let Update = req.body.isActive;
        await Users.findOneAndUpdate({ _id: req.params.id }, { $set: { isActive: Update } }, { new: true })
        res.status(201).json({ Message: "Account Activated" })
    } catch (error) {
        console.log("Something Went wrong" + error);
    }
});

//Login;---------------------------------------------------------------------------------------------------------------(4)
Path.post('/Login', async (req, res) => {
    try {
        let Match = req.body.Email;
        let mail = await Users.findOne({ Email: Match })
        if (mail == null) {
            res.status(404).json({ Message: "User Not Found" });
        }
        if (mail.isActive != 'Active') {
            res.status(403).json({ Message: "Your Account is InActive" });
        }
        let compare = await bcrypt.compare(req.body.Password, mail.Password);
        console.log(compare);
        if (compare) {
            let token = jwt.sign({ _id: mail._id }, Secret, { expiresIn: '20m' });
            res.json({ token });
        } else {
            res.status(404).json({ Message: "Email or Password wrong" });
        }
    } catch (error) {
        console.log('Something went wrong' + error);
    }
})

//Forgot password;-----------------------------------------------------------------------------------------------------(5)
Path.post('/Forgot', async (req, res) => {
    try {

        //Email find and Generating Reset password link;
        let Reset = req.body.Email;
        let check = await Users.findOne({ Email: Reset })
        if (check) {
            let email = check.Email
            let token = jwt.sign({ _id: check._id }, Secret, { expiresIn: '5m' });

            const Link = `${process.env.CONNECTION}/Update/${check._id}/${token}`;

            //Reset link send via Email;
            //Send a link Via mail;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: FROM,
                    pass: PASSWORD
                }
            });

            var mailOptions = {
                from: FROM,
                to: email,
                subject: 'Password Reset Link',
                text: "Click this Link Reset your password",
                html: `<Link to=${Link} target="_blank">${Link}</Link>`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent:' + info.response);
                }
            });
            res.status(201).json({ Message: "Reset Link send to mail" });
        } else {
            res.status(404).json({ Message: "User not found" });
        }
    } catch (error) {
        console.log('Something Went wrong' + error);
    }
})

//New password update;-----------------------------------------------------------------------------------------------(6)
Path.put('/Reset-Password/:id/:token', async (req, res) => {
    try {
        //Collect Req data
        let ideate = req.params.id;
        let verify = req.params.token;

        //New Password hashing;
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.Password, salt);
        req.body.Password = hash;

        //Link Time Validation;
        let compare = jwt.verify(verify, Secret);
        if (compare) {
            //Verification and Update the New Password;
            let Modify = await Users.findOneAndUpdate({ id: ideate }, { $set: { Password: hash } }, { new: true });
            res.json({ Modify })
        } 
    } catch (error) {
        res.status(440).json({ Message: "Session Expired" })
    }
})


//Export express Router;
module.exports = Path;