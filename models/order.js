///////////////////////////
//* ERSÄTT MED TARAS KOD *//
///////////////////////////

const mongoose = require('mongoose');
const Product = require('./Product')

const orderSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    timeStamp: Date,
    status: Boolean,
    items: [String]
    //orderValue: Number
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order