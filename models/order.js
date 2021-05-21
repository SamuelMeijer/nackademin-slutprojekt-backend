const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timeStamp: Date, 
  status : Boolean,
  items: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',  required: true}, 
  orderValue: Number
     
  }); 

module.exports = mongoose.model('Order', orderSchema);