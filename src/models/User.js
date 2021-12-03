const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

// name, email, password
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    mobile: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String
    },
    otp: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

userSchema.virtual('subscribers', {
    ref: 'Subscriber',
    localField: '_id',
    foreignField: 'userId'
})

// find user by roles
userSchema.statics.findByRoles = async (role) => {
    try{
        const users = await User.find()
        const validUsers = [];
        users.forEach(user => {
            if(user.roles === role){
                validUsers.push(user)
            }
        });
        return validUsers
    }
    catch(e){
        console.log(e)
    }
}


// finding user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    
    if (!user) {
        throw new Error('Wrong Credentials!')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
        throw new Error('Wrong Credentials!')
    }
    
    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User