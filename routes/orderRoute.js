const express= require('express'); 
const router= express.Router(); 
const mongoose = require('mongoose'); 
const app = require('../app');

const Order = require('../models/Order');

const Product= require('../models/Product')




 // Post request 
router.post('/', (req, res) =>{
    const newOrder = new Order({
        _id: new mongoose.Types.ObjectId(), 
        timeStamp : Date.now(), 
        status: true, 
        orderValue: req.body.orderValue, 
        items: req.body.items     
     
     })
  
newOrder.save((err) => {
    if(err) {
        return res.json({
            sucess: {
                status: '' , 
                msg: ' Some th'
            }
        })
            }else{
                // return res.json({
                //     sucess:{
                //         status:200, 
                //         msg:' Order has added'
                //     }

                // })
                console.log('Create an Order')
                res.json(newOrder)
            }
})
console.log(req.body)
})


///// 
// router.post ('/', (req, res) =>{
//     const order = Order.findById
//     order.item.push(req.body.Product)
//     order.save()
//     res.json(order.item)

// })
// C


// router.get('/', async (req, res ) =>{
//     const cart = await Product. findById().populate('items'); 
    
//     let total= Product.items.reduce((accumulator, current) => {
//         return accumulator + current.orderValue
//     },0)
//     res.json(cart, total)

// } )
    
    router.get  ('/', async (req, res) =>{
        const cart = await Order.find({})
        res.json(cart)
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