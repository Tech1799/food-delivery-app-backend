// const express = require('express')
const User = require('../../models/User')
const { verificationMail } = require('../../emails/signupOTP');
var userEmail = ''
var otp;

const sendVerificationMail = async (req, res) => {
    userEmail =  req.body.email
    try{
        const mails = await User.find().select('email')
        mails.forEach(mail => {
            if(mail.email === userEmail){
                // res.status(400).send('this email is already in use')
                throw new Error('this email is already in use!')
            }
        })
        otp = Math.floor(Math.random()*1000000).toString()
        verificationMail(userEmail, otp)
        res.clearCookie('verifiedEmail')
        setTimeout(()=>{
            otp = undefined
        }, 120000)
        res.send({
            "message": "verification mail sent! OTP will expire in 60 seconds"
        })
    }
    catch(e){
        res.status(404).send({
            "error": "there is something wrong with emails"
        })
    }
}

const otpVerify = async (req, res) => {
    try{
        if(req.body.otp != otp){
            res.status(400).send({
                "error": "otp not matched"
            })
        }
        else{
            console.log('otp checking is okay!')
            req.body.name = 'John Doe'
            req.body.email = userEmail
            req.body.password = 'password'
            req.body.roles = []
            req.body.otp = otp
            req.body.isVerified = true
            const user = new User(req.body)
            console.log(user);
            await user.save()
            res.cookie('verifiedEmail', otp, {
                httpOnly: true,
                maxAge: 259200*1000
            })
            res.send({
                "message": "email is verified"
            })
        }
    }
    catch(err){
        res.status(400).send({
            "code": err,
            "error": "otp is not verified"
        })
    }
}

module.exports = {
    sendVerificationMail,
    otpVerify
}