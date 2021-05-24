const express= require('express'); 
const router= express.Router(); 
const mongoose = require('mongoose'); 
const app = require('../app');
const jwt= require('jsonwebtoken')

const Order = require('../models/Order');
const User= require('../models/User')
const Product= require('../models/Product')


const cookieParser = require('cookie-parser');
router.use(cookieParser())


 // Post request 
router.post('/', async(req, res) =>{
    const user= await User.findOne({email: req.body.email })
    // .populate('items')
        
    const newOrder = await new Order({
        _id: new mongoose.Types.ObjectId(), 
        timeStamp : Date.now(), 
        status: true, 
        orderValue: req.body.orderValue, 
        // orderValue: Number,
        items: req.body.items, 
      
         })
         
    if(user){
        user.orderHistory.push(newOrder._id); 
     
    }
    console.log(req.body)

         // Save Order
newOrder.save((err) => {
    if(err) {
        return res.status(417).send('Expectation Failed! ')
            }else{
                console.log('Create an Order')
                res.json(newOrder)
            }
})

})

// Calculating cart
// router.get('/', async (req, res ) =>{
//     const cart = await Product. findById(req.params.id).populate('items'); 
    
//     let total= Product.items.reduce((accumulator, current) => {
//         return accumulator + current.orderValue
//     },0)
//     res.json(cart, total)

// } )


    // putting Items in the cart
    router.get  ('/', async (req, res) =>{
        const user= await User.findOne({
            email: req.cookies['auth-token']['user']['email'],
        })
        if( user.role == 'admin'){
        const orderHistory = await Order.find({})
        res.json(orderHistory)
        }
        else if(user.role == 'customer'){
            const orderHistory = await Order.find({})
            res.json(orderHistory)
        }
        else {
        return res.status(401).send('Unauthorized ')}
    
    })
    
    
//     router.get('/', (req, res, next)=>{
//         Order.findById(req.params.newOrder)
//         .then(order =>{
//             if (!order){
//                 return res.status(404).json({
//                     message:" Order not Found!!"
//                 })
//             }
//     res.status(200).json({
//         order: newOrder, 
      
//     })
//         }).catch(err =>{
//             res.status(500).json({
//                 error: err
//             })
//         })
    
//     })

// })



     module.exports= router; 