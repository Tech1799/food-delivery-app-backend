const User = require('../../models/User')
const Otp = require('../../models/Otp')
// const { verificationMail } = require('../../emails/signupOTP');


const sendVerificationMail = async (req, res) => {
    const userEmail =  req.body.email
    try{
        const mails = await User.find().select('email')
        const mailArr = []
        mails.forEach(mail => mailArr.push(mail.email))
        if(userEmail === null){
            res.status(400).json({
                error: 'please provide email as request'
            })
        }
        if(mailArr.includes(userEmail)){

            res.status(400).send('this email is already in use')
        }
        else{
            const rawOtp = Math.floor(Math.random()*1000000).toString()
            const otp = new Otp({
                email: userEmail,
                otp: rawOtp,
            })
            console.log(otp);
            // verificationMail(userEmail, rawOtp)
            await otp.save()
            res.clearCookie('unverifiedEmail')
            res.cookie('unverifiedEmail', userEmail, {
                httpOnly: true,
                maxAge: 300*1000
            })
            res.send({
                "message": "verification mail sent! OTP will expire in 5 minutes"
            })
        }
    }
    catch(err){
        res.status(404).json({
            err,
            error: "there is something wrong with emails"
        })
    }
}

const otpVerify = async (req, res) => {
    try{
        const userEmail = decodeURIComponent(req.cookies.unverifiedEmail)
        console.log(userEmail)
        if(!userEmail){
            res.status(400).json({
                error: "please provide email as request"
            })
        }
        const otp = await Otp.find({ email: userEmail })
        const otpArr = []
        otp.forEach(mail => otpArr.push(mail.otp))
        console.log(otpArr)
        if(!otpArr.includes(req.body.otp)){
            res.status(400).send({
                "error": "otp not matched"
            })
        }
        else{
            const user = new User({
                name: 'John Doe',
                email: otp.email,
                password: 'password',
                otp: otp.otp,
                isVerified: true
            })
            res.clearCookie('verifiedOtp')
            res.cookie('verifiedOtp', req.body.otp, {
                httpOnly: true,
                maxAge: 259200*1000
            })
            // await user.save()
            res.send({
                user,
                "message": "email is verified"
            })
        }
    }
    catch(err){
        res.status(400).json({
            error: err.message,
            // error: "otp is not verified"
        })
    }
}

module.exports = {
    sendVerificationMail,
    otpVerify
}