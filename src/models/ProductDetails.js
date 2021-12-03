const mongoose = require("mongoose");
// const validator = require("validator");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
    },
    descMeta: {
        type: String,
    },
    title: {
        type: String,
    },
    link: {
        type: String,
        lowercase: true,
        validate(value){
            if(value.indexOf(' ')>= 0){
                throw new Error('do not use whitespace in the string')
            }
        }
    },
    primaryImage: {
        type: Buffer,
        
    },
    images: [{
        image: {
            type: Buffer
        }
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    foodType: {
        type: String,
    },
    isStock: {
        type: Boolean,
    }
},
{
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product