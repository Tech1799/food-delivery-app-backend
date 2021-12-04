const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    otp: {
        type: String
    },
    createdAt: {
        type: Date,
        expires: '5m',
        default: Date.now
    }
})

const Otp = mongoose.model('Otp', otpSchema)

module.exports = Otp