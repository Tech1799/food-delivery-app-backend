const express = require('express');
const {requireAuth} = require('../middlewares/auth');
const router = new express.Router();

const {
    signupAdmin,
    signupCustomer,
    loginUser,
    logoutUser,
    readAllCustomers,
    readById,
    deleteById,
} = require('../controllers/login/user.controller')

router.post('/signup/admin', signupAdmin)
router.patch('/signup/customer', signupCustomer)
router.post('/login', loginUser)
router.get('/logout/customer', logoutUser)
router.get('/all/customers', requireAuth, readAllCustomers)
router.get('/:id', readById)
router.delete('/delete/:id', deleteById)

module.exports = router