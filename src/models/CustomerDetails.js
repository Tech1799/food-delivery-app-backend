const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        type: String
    },
    avatar: {
        type: Buffer
    }
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer