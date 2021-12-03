const express = require('express');
const multer = require('multer');
const Product = require('../models/ProductDetails');

const {requireAuth} = require('../middlewares/auth');
const {paginatedResults} = require('../middlewares/pagination');

const router = new express.Router();

const {
    addProduct,
    addImages,
    readAllProducts
} = require('../controllers/ecommerce/product.controller');


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})



router.post('/add', requireAuth, upload.single('primaryImage'), addProduct);
router.post('/add/images', addImages);
router.get('/all', requireAuth, paginatedResults(Product), readAllProducts)




module.exports = router