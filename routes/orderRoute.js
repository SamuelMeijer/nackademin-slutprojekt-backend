
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
router.post('/', (req, res) => {

    const newOrder = new Order({

        _id: 123,
        timeStamp: Date.now(),
        status: true,
        items: [{
            type: new mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        orderValue: Number // Skriva formel här
    })

    // Sparar användaren
    newOrder.save((err) => {
        if (err) {
            res.json(err)
        } else {
            res.json(newOrder)
        }
    })
})


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
})

module.exports = router;