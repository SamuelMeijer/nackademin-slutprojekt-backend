const mongoose = require('mongoose');


const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    email: String, //{ type: String, required: true },
    password: String,//{ type: String, required: true },
    name: String,//{ type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' } ,

    adress: {
        street: String, //{ type: String, required: true },
        zip: Number, //,{ type: Number, required: true },
        city: String, //{ type: String, required: true }
    },
   orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
}],
})

const User = mongoose.model('User', userSchema);

module.exports = User