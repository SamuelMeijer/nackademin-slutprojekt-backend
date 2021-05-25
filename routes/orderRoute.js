const express= require('express'); 
const router= express.Router(); 
const mongoose = require('mongoose'); 
const app = require('../app');
const jwt= require('jsonwebtoken')

const Order = require('../models/Order');
const User= require('../models/User')
const Product= require('../models/Product')
const jwtAuthentication = require('../middleware/jwtAuthentication');


const cookieParser = require('cookie-parser');
require('dotenv').config()
router.use(cookieParser())


 // Post request 
router.post('/', async(req, res) =>{
    const user= await User.findOne({email: req.body.email })
 
            
    const newOrder = await new Order({
        _id: new mongoose.Types.ObjectId(), 
        timeStamp : Date.now(), 
        status: true, 
        orderValue: req.body.orderValue, 

         })
         
    if(user){
        user.orderHistory.push(newOrder._id); 
     
    }
    console.log(req.body)

         // Save Order in database
newOrder.save((err) => {
    // Error Handeling with if ,else method
    if(err) { 
        return res.status(417).send('Expectation Failed! ')

            }else{
            console.log('Create an Order')
                res.json(newOrder)
            }
})

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