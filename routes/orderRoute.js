
const mongoose = require('mongoose');
const jwtAuthentication = require('../middleware/jwtAuthentication');
const router = require('express').Router();

// cookie parser
const cookieParser = require('cookie-parser');
// Behövs för att kunna hämta req.cookies
router.use(cookieParser())

// Importing models
const Order = require('../models/Order')
const User = require('../models/User');
const Product = require('../models/Product')





// Adding products
router.post('/',  async (req, res) => {


    // HAR FASTNAT HÄR :D
/* const product = await Product.findById( {_id: '60aa75772c85599b20d719e8'})
    
    
    let calcOrderValeu = product.price.reduce((accumulator, current) => {
        return accumulator + current.price
    }, 0) */
 
    const newOrder = new Order({

        _id: new mongoose.Types.ObjectId(),
        timeStamp: Date.now(),
        status: true,
        items: req.body.items,
        orderValue: 10, 
        // orderValue: calcOrderValue istället
    })

    // Sparar den nya ordern till databasen
    newOrder.save((err) => {
        if (err) {
            res.json(err)
        } else {

            // Skickar ett json.response innehållandes newOrder
            res.json(newOrder)
        }
    })


    const user =  await User.findOne({ email: req.cookies['auth-token']["user"]["email"] })

    user.orderHistory.push(newOrder._id)

    await User.findByIdAndUpdate(user._id, user);


})



router.get('/', jwtAuthentication, async (req, res) => {

    const user = await  User.findOne({ email: req.cookies['auth-token']["user"]["email"]})
  // const user = await  User.findOne({ email: payload.uid.email}, {orderHistory: 1}).populate('orderHistory')
    console.log(user.role)

    if (user.role == 'customer') {

        const userOrders = await  User.findOne({ email: req.cookies['auth-token']["user"]["email"]}, {orderHistory: 1}).populate('orderHistory')
    //const userOrderHistory = user.populate('orderHistory')

        console.log(userOrders.orderHistory)

        res.json(userOrders.orderHistory)
       /*  const userOrderHistory = []

    user.orderHistory.forEach( async orderId => {
    const order = await Order.findById(orderId).populate('order')
    // const order = await Product.findById(req.params.id)
    
    userOrderHistory.push(order)
    })
 
  console.log(order)


console.log('från rad 75',userOrderHistory)
res.json(userOrderHistory)

*/

        // res.json(orderHistory)

    } else if (user.role == 'admin'){
        
        const adminOrders = await  Order.find({})

        res.json(adminOrders)

    } else {
        res.send('Du måste vara inloggad för at kunna se')
    }
})

module.exports = router;