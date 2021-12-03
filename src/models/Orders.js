const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderType: {
        type: String,
        required: true,
        validate(value) {
            if(value !== ('self' || 'group')){
                throw new Error('Provided value is out of options')
            }
        }
    },
    contact: {
        type: String,
        required: true
    },
    deliveryLocation: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date,
        default: Date.now()
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order