const mongoose = require('mongoose');

// Till senare
// const Order = require('../models/order')

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: String, // or customer

    adress: {
        street: { type: String, required: true },
        zip: { type: Number, required: true },
        city: { type: String, required: true }
    },
    // Hämta från order sen!
    /* orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }] */
})

const User = mongoose.model('User', userSchema);

module.exports = User