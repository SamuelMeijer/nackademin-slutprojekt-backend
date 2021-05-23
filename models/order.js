///////////////////////////
//* ERSÄTT MED TARAS KOD *//
///////////////////////////

const mongoose = require('mongoose');
const Product = require('./Product')

const orderSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    timeStamp: Date,
    status: Boolean,
    items: [String],
    orderValue: Number
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order





// Hämta data - även om maten och dess priser.
// Hämta info och produkterna och dess priser
// const product = await Products.findById(new).populate('price')

// Använd js inbyggda reduce-funktion för att summera priserna.
/* let total = user.tray.reduce((accumulator, current) => {
    return accumulator + current.price
}, 0) */


