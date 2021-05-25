const mongoose = require('mongoose');


const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true },
    password: { 
        type: String, 
        required: true },
    name: { 
        type: String, 
        required: true },
    role: { 
        type: String, 
        // Enum limits the value of role to be either customer or adming
        enum: ['customer', 'admin'], 
        // Sets the default value of role to 'customer'
        default: 'customer' } ,

    adress: {
        street: { 
            type: String, 
            required: true },
        zip: { 
            type: Number, 
            required: true },
        city: { 
            type: String, 
            required: true }
    },
   orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
}],
})

const User = mongoose.model('User', userSchema);

module.exports = User