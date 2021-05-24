
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





// Adding products
router.post('/',  async (req, res) => {

    const newOrder = new Order({

        _id: new mongoose.Types.ObjectId(),
        timeStamp: Date.now(),
        status: true,
        items: req.body.items,
        orderValue: 1,
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

    // console.log('userUpdate rad 50', userUpdate)

})



router.get('/', jwtAuthentication, async (req, res) => {

    const user = await  User.findOne({ email: req.cookies['auth-token']["user"]["email"]}, {orderHistory: 1}).populate('orderHistory')
  // const user = await  User.findOne({ email: payload.uid.email}, {orderHistory: 1}).populate('orderHistory')

    if (user.role == 'customer') {

    //const userOrderHistory = user.populate('orderHistory')

        console.log(user.orderHistory)

        res.json(user)
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
        const orders =  Order.find({})
        res.json(orders)

    } else {
        res.send('Du måste vara inloggad för at kunna se')
    }
})

module.exports = router;