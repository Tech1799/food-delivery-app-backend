// const express = require('express')
const User = require('../../models/User')
const { verificationMail } = require('../../emails/signupOTP');
var otpObj = {};


const sendVerificationMail = async (req, res) => {
    const userEmail =  req.body.email
    try{
        const mails = await User.find().select('email')
        const mailArr = []
        mails.forEach(mail => mailArr.push(mail.email))
        console.log(mails);
        if(userEmail === undefined){
            res.send('please provide email as request')
        }
        if(mailArr.includes(userEmail)){
            res.status(400).send('this email is already in use')
        }
        else{
            otpObj[userEmail] = Math.floor(Math.random()*1000000).toString()
            verificationMail(userEmail, otpObj[userEmail])
            res.clearCookie('verifiedEmail')
            setTimeout(()=>{
                otpObj[userEmail] = undefined
            }, 120000)
            res.send({
                "message": "verification mail sent! OTP will expire in 120 seconds"
            })
        }
    }
    catch(e){
        res.status(404).json({
            error: "there is something wrong with emails"
        })
    }
}

const otpVerify = async (req, res) => {
    try{
        const userEmail = req.body.email
        if(req.body.otp != otpObj[userEmail]){
            res.status(400).send({
                "error": "otp not matched"
            })
        }
        else{
            const user = new User({
                name: 'John Doe',
                email: userEmail,
                password: 'password',
                otp: req.body.otp,
                isVerified: true
            })
            await user.save()
            res.cookie('verifiedEmail', req.body.otp, {
                httpOnly: true,
                maxAge: 259200*1000
            })
            res.send({
                "message": "email is verified"
            })
        }
    }
    catch(err){
        res.status(400).json({
            err,
            error: "otp is not verified"
        })
    }
}

module.exports = {
    sendVerificationMail,
    otpVerify
}