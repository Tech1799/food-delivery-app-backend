// image, product_name, price, quantity
// features: total, remove, apply code

const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    }]
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart