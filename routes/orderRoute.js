const router = require('express').Router(); 
const mongoose = require('mongoose'); 


const jwtAuthentication = require('../middleware/jwtAuthentication');



const cookieParser = require('cookie-parser');
router.use(cookieParser())

// Importing models
const Order = require('../models/Order')
const User = require('../models/User');
const Product = require('../models/Product')

// Post request 
router.post('/', async (req, res) => {
    /* ***** CALCULATING orderValue ***** */
    // TODO: Remove, testing with console.log
    console.log('REQ.BODY.ITEMS :', req.body.items)


    let calcOrderValue = await req.body.items.reduce(async (accumulator, currentElement) => {
        const addedProd = await Product.findById({_id: currentElement});
        // TODO: Remove, testing with console.log
        console.log('addedProd :', addedProd);
        console.log('accumulator :', accumulator);
        return await accumulator + addedProd.price;
    }, 0)
    // TODO: Remove, testing with console.log 
    console.log('calcOrderValue :', calcOrderValue);


    const user = await User.findOne({ email: req.cookies['auth-token']["user"]["email"]})
            
    const newOrder = await new Order({
        _id: new mongoose.Types.ObjectId(), 
        timeStamp : Date.now(), 
        status: true, 
        orderValue: calcOrderValue, 
        items: req.body.items
        })
         
    console.log(req.body)

         // Save Order in database
  newOrder.save((err) => {
    // Error Handeling with if ,else method
    if(err) { 
        return res.status(417).send('Expectation Failed! ')

    }else{
        console.log('Create an Order')
      
        if(user){
          user.orderHistory.push(newOrder._id); 
        }
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