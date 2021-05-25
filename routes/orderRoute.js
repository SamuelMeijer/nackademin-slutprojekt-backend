const router = require('express').Router(); 
const mongoose = require('mongoose'); 

const Order = require('../models/Order');
const User = require('../models/User')
const Product = require('../models/Product')
const jwtAuthentication = require('../middleware/jwtAuthentication');

const cookieParser = require('cookie-parser');
router.use(cookieParser())


// Post request 
router.post('/', jwtAuthentication, async (req, res) => {
    
    // Evaluates if the order does not contain any items
    if (req.body.items.length === 0) {
        res.status(400).send('The order needs to contain items')
    
    } else {

        // Calculating orderValue
        let calcOrderValue = await req.body.items.reduce(async (accumulator, currentElement) => {
            const addedProd = await Product.findById({_id: currentElement});

            return await accumulator + addedProd.price;
        }, 0)


        const user = await User.findOne({ email: req.cookies['auth-token']["user"]["email"]})
                
        const newOrder = await new Order({
            _id: new mongoose.Types.ObjectId(), 
            timeStamp : Date.now(), 
            status: true, 
            orderValue: calcOrderValue, 
            items: req.body.items
            })
            
        console.log(req.body)
        
        if (user) {
            // Save Order in database
            newOrder.save(async (err) => {
                // Error Handeling with if ,else method
                if (err) { 
                    return res.status(417).send('Expectation Failed! ')

                } else {
                    console.log('Create an Order')
                
                    user.orderHistory.push(newOrder._id);
                    await User.findByIdAndUpdate(user._id, user)

                    res.json(newOrder)
                }
            })
        } else {
            res.status(401).send('You have to be registered to place an order')
        }
    }
})

// get method from database
router.get('/', jwtAuthentication, async (req, res) => {
        const user = await User.findOne({ email: req.cookies['auth-token']["user"]["email"]})
        // const user = await  User.findOne({ email: payload.uid.user.email}, {orderHistory: 1}).populate('orderHistory')
        if (user.role == 'customer') {
            const userOrders = await  User.findOne({ email: req.cookies['auth-token']["user"]["email"]}, {orderHistory: 1}).populate('orderHistory')
            res.status(200).json(userOrders.orderHistory)
        } else if (user.role == 'admin'){
            const adminOrders = await  Order.find({})
            res.json(adminOrders)
        } else {
            res.send('Du måste vara inloggad för at kunna se')
        }
})

module.exports= router;