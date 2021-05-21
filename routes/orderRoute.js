
const mongoose = require('mongoose');
const jwtAuthentication = require('../middleware/jwtAuthentication');
const router = require('express').Router();

const Order = require('../models/Order')
const Product = require('../models/Product');
const User = require('../models/User');

// cookie parser
const cookieParser = require('cookie-parser');
// Behövs för att kunna hämta req.cookies
router.use(cookieParser())




// Lägga till produkter
router.post('/', async (req, res) => {


    const newOrder = new Order({

        _id: new mongoose.Types.ObjectId(),
        timeStamp: Date.now(),
        status: true,
        items: req.body.items,
        //orderValue: Number // Skriva formel här
    })


    // Sparar användaren
    newOrder.save((err) => {
        if (err) {
            res.json(err)
        } else {
            res.json(newOrder)
        }
    })

    const user = await User.findOne({ email: req.cookies['auth-token']["user"]["email"] })

    user.orderHistory.push(newOrder._id)

    const userUpdate = await User.findByIdAndUpdate(user._id, user);

    console.log(user.orderHistory)

})

/* 
router.get('/', jwtAuthentication, async (req, res) => {

    const user =  User.findOne({ email: req.body.email })

    if (user.role == 'customer') {
        const orders =  Order.find({})
        res.json(orders)
    } else if (user.role == 'admin'){
        const orders =  Order.find({})
        res.json(user.orderHistory)
    } else {
        res.send('Du måste vara inloggad för at kunna se')
    }
}) */

module.exports = router;