const Category = require('../../models/Category');

const addCategory = async(req, res)=>{
    try{
        if(!res.locals.user.roles.includes('admin panel')){
            res.status(400).send({"error": "access denied (admin route)"})
        }
        else{
            const category = new Category({...req.body})
            await category.save()
            res.send({
                "message": "category added successfully!",
                "data": category
            })
        }
    }
    catch(err){
        res.status(400).send(err)
    }
}

module.exports = {
    addCategory
}