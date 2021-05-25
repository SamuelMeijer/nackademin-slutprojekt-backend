const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timeStamp: Date, 
  status : Boolean,
  items:[String], 
  orderValue: Number, 
  price:Number

    }); 

module.exports = mongoose.model('Order', orderSchema);