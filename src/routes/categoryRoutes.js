const express = require('express');
const {requireAuth} = require('../middlewares/auth');
const router = new express.Router();

const {
    addCategory
} = require('../controllers/ecommerce/category.controller');

router.post('/add', requireAuth, addCategory)

module.exports = router