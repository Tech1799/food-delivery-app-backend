const express = require('express');
const router = new express.Router();

const {
    sendVerificationMail,
    otpVerify
} = require('../controllers/verification/verification.controller')

router.post('/send-mail', sendVerificationMail)
router.post('/otp', otpVerify)


module.exports = router