/* eslint-disable no-constant-condition */
const mongoose = require('mongoose');
// const validator = require('validator');


// subscription type, order type, food type, optional Contact number, quantity, start date
const subscriberSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subsType: {
        type: String,
        validate(value) {
            if(!(value === 'npkhana' || 'thkhana')){
                throw new Error('Provided value is out of options')
            }
        }
    },
    orderType: {
        type: String,
        validate(value) {
            if(!(value === 'self' || 'group')){
                throw new Error('Provided value is out of options')
            }
        }
    },
    foodType: {
        type: String,
        validate(value) {
            if(!(value === 'veg' || 'non-veg')){
                throw new Error('Provided value is out of options')
            }
        }
    },
    optContact: {
        type: String
    },
    quantity: {
        type: Number
    },
    startDate: {
        type: String,
        default: new Date
    }

},
{
    timestamps: true
})

const Subscriber = mongoose.model('Subscriber', subscriberSchema)

module.exports = Subscriber