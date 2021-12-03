module.exports.paginatedResults = function(model) {
    return async(req, res, next) => {
        const results = {} //totalDocuments, previous, next, result
        const query = {} //page, limit
        const index = {} // start, end
        const intLimit = parseInt(req.query.limit)
        const intPage = parseInt(req.query.page)
        
        try{
            if(!(req.query.limit && req.query.page)){
                query.page = 1
                query.limit = 5
            }
            else if(isNaN(intLimit)){
                query.limit = 5
                results.validation = 'limit query input is NaN, redirecting to default value (limit = 5)'
            }
            else if(isNaN(intPage)){
                query.page = 1
                results.validation = 'Page query input is NaN, redirecting to default value (page = 5)'
            }
            else{
                query.page = intPage
                query.limit = intLimit
            }
            
            results.totalDocuments = await model.countDocuments().exec()
            
            if(query.page > (results.totalDocuments/query.limit)){
                query.page = Math.ceil(results.totalDocuments/query.limit)
                console.log(query.page);
            }
            
            index.start = (query.page - 1) * query.limit
            index.end = query.page * query.limit
    
            if(index.start > 0){
                results.previous = {
                    page: query.page - 1,
                    limit: query.limit
                }
            }

            if(index.end < results.totalDocuments){
                results.next = {
                    page: query.page + 1,
                    limit: query.limit
                }
            }
            results.result = await model.find().limit(query.limit).skip(index.start).exec()
            res.paginatedResults = results
            next()
        }
        catch(err){
            res.status(500).json({error: err.message})
        }
    }
}