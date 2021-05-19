const mongoose = require('mongoose');
const router = require('express').Router();
const Product = require('../models/product');


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
router.get('/', async (req, res) => {
    const products = await Product.find({}).populate('product')
    console.log(products)
    res.json(products)
})

module.exports = router;
