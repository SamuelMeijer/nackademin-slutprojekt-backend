const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    email: String,
    password: String,
    name: String,
    role: String, // or customer

    adress: {
        street: String,
        zip: Number,
        city: String
    },
    orderHistory: []
} )

const User = mongoose.model('User', userSchema);

module.exports = User