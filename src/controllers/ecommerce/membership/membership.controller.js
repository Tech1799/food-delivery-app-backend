/* eslint-disable no-constant-condition */
const Subscriber = require('../../../models/Subscribers')

const subscribe = async(req, res) => {
    // res.send(res.locals.user._id)
    const subscriber = new Subscriber({
        userId: res.locals.user._id,
        ...req.body
    })
    try{
        await subscriber.save()
        res.send(`${res.locals.user.name} has subscribed to ${subscriber.subsType} subscription`)
    }
    catch(e){
        res.status(400).send(e)
    }
}

const readAllSubscribers = async(req, res)=>{
    try{
        res.send(res.paginatedResults)
    }
    catch(err){
        res.status(400).json({ error: err.message })
    }
}

const readSubscriberById = async(req, res)=>{
    await Subscriber.find({userId: res.locals.user._id}).populate('userId', 'name').exec((err, docs)=>{
        if(err) throw(err)
        res.json(docs)
    })

}

module.exports = {
    subscribe,
    readAllSubscribers,
    readSubscriberById
}