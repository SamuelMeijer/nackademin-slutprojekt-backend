const mongoose = require('mongoose');
const router = require('express').Router();
const Product = require('../models/Product');

router.post('/', (req, res) => {
  const newProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    price: req.body.price,
    shortDesc: req.body.shortDesc,
    longDesc: req.body.longDesc,
    imgFile: req.body.imgFile,
  });
  newProduct.save((err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('The new product has been saved');
      res.json('The new product has been saved');
    }
  });
  console.log(req.body);
});

router.get('/', async (req, res) => {
  const allProducts = await Product.find({}).populate('product');

  res.json(allProducts);
});

/* 
const products = [
    {
        _id: '39y7gbbZk1u4ABnv',
        title: 'Gretas Fury',
        price: 999,
        shortDesc: 'Unisex',
        longDesc: 'Skate ipsum dolor sit amet...',
        imgFile: 'skateboard-greta.png'
    },
    {
        _id: '39y7gbbZk1u4ABnv',
        title: 'Skateboard',
        price: 799,
        shortDesc: 'Unisex',
        longDesc: 'Skate ipsum dolor sit amet...',
        imgFile: 'skateboard-generic.png'
    }
    {
        _id: '39y7gbbZk1u4ABnv',
        title: 'Wheel Rocket',
        price: 200,
        shortDesc: 'Unisex',
        longDesc: 'Skate ipsum dolor sit amet...',
        imgFile: 'skateboard-generic.png'
    }
]
app.get('/api/products', (req, res) => {
    res.json(products)
}) */

module.exports = router;
