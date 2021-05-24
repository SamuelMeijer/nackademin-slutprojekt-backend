const mongoose = require('mongoose');

// Till senare
const Order = require('./Order')

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    role: String, // or customer

    adress: {
        street: { type: String, required: true },
        zip: { type: Number, required: true },
        city: { type: String, required: true }
    },
   orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
}],
})

const User = mongoose.model('User', userSchema);

module.exports = User