const router = require('express').Router(); 
const mongoose = require('mongoose'); 

// Authorization 
const jwtAuthentication = require('../middleware/jwtAuthentication');

// Cookie Parser
const cookieParser = require('cookie-parser');
router.use(cookieParser())

// Importing models
const Order = require('../models/Order')
const User = require('../models/User');
const Product = require('../models/Product')

// Post request 
router.post('/', jwtAuthentication, async (req, res) => {
    // Evaluates if the order does not contain any items
    if (req.body.items.length === 0) {
        res.status(400).send('The order needs to contain items')
    
    } else {
        // Calculating orderValue
        // Iterating through req.body.items which is an array filled with productId:s and calculates the total sum of the order
        let calcOrderValue = await req.body.items.reduce(async (accumulator, currentElement) => {
            // Finding a product with the productID corresponding to the value of currentElement in the database
            const addedProd = await Product.findById({_id: currentElement});
            // Adding the price of the product to 'accumulator'
            return await accumulator + addedProd.price;
        }, 0) // Setting the starting value of accumulator to zero


        // Fetch data & using auth-token method by checking if the email adress is exist and it is correct
        const user = await User.findOne({ email: req.cookies['auth-token']["user"]["email"]})

        //Create order by useing order models   
        const newOrder = await new Order({
            _id: new mongoose.Types.ObjectId(), 
            timeStamp : Date.now(), 
            status: true, 
            orderValue: calcOrderValue, 
            items: req.body.items
            })

        // Save Order in to the database
        newOrder.save(async(err) => {
        // Error handeling with if - else statement Method
            if(err) { 

        // if the order doesn't exist user can not submit anything, else creat an order
                return res.status(417).send('Expectation Failed! ')

            }else{
                
        // 1- Push the order to orderHistodry (orderHistory is exist in user account)
        //2- Save the orde by recognizig (_id), (in case, if u are an user and log-in befor ordering)
                if(user){
                user.orderHistory.push(newOrder._id); 
                await User.findByIdAndUpdate(user._id, user)
                }
                res.json(newOrder)
            }
        })
    }
})


// Using Get method to get user from database
router.get('/', jwtAuthentication, async (req, res) => {

// Find log-in user in the database, and email address which it saved in cookies (which it excit id auth-token)  by checking if the email adress is correct
       const user = await User.findOne({ email: req.cookies['auth-token']["user"]["email"]})
// if you are an customer and login u can see all orders.
// if the email address is correct u are a customer and u are able to see all your orders
if (user.role == 'customer') {
            const userOrders = await User.findOne({ email: req.cookies['auth-token']["user"]["email"]}, 
// if One order is exist in the orderHistory customer can connect, Populate method refer to ObjectId array in the documets. 
            {orderHistory: 1}).populate('orderHistory')
// customer can see his order
            res.status(200).json(userOrders.orderHistory)

// if you are an admin first you have to log-in then you can see all orders!  
        } else {
            const adminOrders = await Order.find({})
            res.json(adminOrders)
        } 
})

module.exports= router;
