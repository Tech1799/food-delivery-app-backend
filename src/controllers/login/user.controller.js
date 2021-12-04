const User = require('../../models/User');
const jwt = require('jsonwebtoken');
// const handleErrors = require('../errorHandling');

// creating json web token
const maxAge = 259200
const createToken = (id, roles) => {
    return jwt.sign({ id, roles }, process.env.JWT_SECRET,{
        expiresIn: maxAge
    })
}

// signup admin (/user/signup/admin)
const signupAdmin = async(req, res)=> {
    const roles = ['view all customers', 'admin panel']
    req.body.roles = roles
    const user = new User(req.body)
    try {
        const result = await user.save()
        res.status(201).send(result)
    }
    catch(e) {
        res.status(400).send(e)
    }
}

// signup Customer (/user/signup/customer)
const signupCustomer = async(req, res)=> {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({
            "error": "Invalid Updates!"
        })
    }
    try {
        const verifiedEmailCookie = decodeURIComponent(req.cookies.verifiedEmail)
        if(!verifiedEmailCookie){
            res.status(401).send({"error": "verify email first"})
        }
        const user = await User.findOne({otp: verifiedEmailCookie})
        if(user.isVerified == true){
            updates.forEach(update => user[update] = req.body[update])
            user.roles = 'Customer'
            user.otp = undefined
            await user.save()
            res.send({ "message": "user signup successfully!" })
        }
        else {
            throw new Error('User is not verified!')
        }
    }
    catch(err) {
        res.status(400).json({
            code: err,
            error: "something went wrong"
        })
    }
}



// login user (/user/login)
const loginUser = async(req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = createToken(user._id, user.roles);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge*1000
    })
    res.status(200).json({ user: user._id, token: token })
    }
    catch(e) {
        res.status(400).send({
            "error": "incorrect credentials!"
        });
    }
}

// logout user (/user/logout)
const logoutUser = async(req, res)=>{
    res.cookie('jwt', '', { maxAge: 1 })
    res.send({
        "message": "Logout Successfully!"
    })
}

// (/user/all/customers)
const readAllCustomers = async(req, res)=>{
    try {
        const user = res.locals.user
        if(user.roles.includes('admin panel')){
            const customers = await User.findByRoles('customer dashboard');
            res.send(customers)
        }
        else {
            throw new Error({"error": "user is not permitted for this action!"})
        }
    }
    catch(e) {
        res.status(400).send(e)
    }
}

const readById = async(req, res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)

        if(!user) {
            return res.status(404).send({
                "message": "data not found!"
            })
        }
        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
}

const deleteById = async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findByIdAndRemove(_id)
        if(!user) {
            res.status(404).send({
                "error": "data not found!"
            })
        }
        res.send(user)
    }
    catch(e) {
        res.status(500).send(e)
    }
}

module.exports = {
    signupAdmin,
    signupCustomer,
    loginUser,
    logoutUser,
    readAllCustomers,
    readById,
    deleteById
}