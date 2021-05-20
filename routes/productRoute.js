///////////////////////////
//* ERSÄTT MED TIMS KOD *//
///////////////////////////

const mongoose = require('mongoose');
const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');

const jwtAuthentication = require('../middleware/jwtAuthentication')
// cookie parser
const cookieParser = require('cookie-parser');
// Behövs för att kunna hämta req.cookies
router.use(cookieParser())


// Lägga till produkter
router.post('/', (req, res) => {

    const newProduct = new Product({
        title: req.body.title,
        price: req.body.price,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        imgFile: req.body.imgFile
    })

    // Sparar användaren
    newProduct.save((err) => {
        if (err) {
            res.json(err)
        } else {
            res.json(newProduct)
        }
    })
})





// Visar alla produkter
router.get('/', jwtAuthentication, async (req, res) => {

    const user = await User.findOne({ email: req.body.email })

    if (user.role == 'customer') {
        const products = await Product.find({}).populate('product')
        console.log(products)
        res.json(products)
    } else if (user.role == 'admin'){
        res.send('Du är admin!')
    } else {
        res.send('Du måste vara inloggad kund för att se varorna')
    }

})

module.exports = router;