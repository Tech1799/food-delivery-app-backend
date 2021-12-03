const express = require('express');
const {requireAuth} = require('../middlewares/auth');
const { paginatedResults } = require('../middlewares/pagination');
const router = new express.Router();
const Subsriber = require('../models/Subscribers');

const {
    subscribe,
    readAllSubscribers,
    readSubscriberById
} = require('../controllers/ecommerce/membership/membership.controller');

router.post('/subscribe', requireAuth, subscribe)
router.get('/all', requireAuth, paginatedResults(Subsriber), readAllSubscribers)
router.get('/me', requireAuth, readSubscriberById)


module.exports = router