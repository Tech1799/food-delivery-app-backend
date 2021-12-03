const mongoose = require('mongoose');


const categorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category