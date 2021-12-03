const Product = require('../../models/ProductDetails');
const Category = require('../../models/Category');
const sharp = require('sharp');

const addProduct = async(req, res) => {
    try{
        if(!res.locals.user.roles.includes('admin panel')){
            res.status(400).send({
                "error": "access denied (admin route)"
            })
        }
        else if(req.file.fieldname === 'primaryImage'){
            const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 }).png().toBuffer()
            const category = await Category.find().select('_id name')
            if(!req.query.category){
                res.status(400).json({error: "category is not provided"})
            }
            category.forEach(child => {
                if(child.name === req.query.category){
                    req.body.category = child._id
                }
            })
            const product = new Product({
                primaryImage: buffer,
                ...req.body
            })
            if(!product.category){
                res.status(400).send({"error": {
                    "category": "either user didn't put value for category or category value does not exist"
                }})
            }
            const result = await product.save()
            res.status(201).send({
                "message": "product added successfully!",
                "data": result
            })
        }
        else{
            res.status(404).send({
                "error": "primaray image not found"
            })
        }
    }
    catch(e) {
        res.status(400).send(e)
    }
}

const addImages = async(req, res)=>{
    res.send('route under construction')
}

const readAllProducts = async(req, res)=>{
    res.send(res.paginatedResults)
}


module.exports = {
    addProduct,
    addImages,
    readAllProducts
}