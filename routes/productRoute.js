const mongoose = require('mongoose');
const router = require('express').Router();
const Product = require('../models/Product');

//Post products
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
      res.json(newProduct);
    }
  });
  console.log(req.body);
});

//Get all products
router.get('/', async (req, res) => {
  const getAllProducts = await Product.find({}); /* .populate('product'); */

  res.json(getAllProducts);
});

//Get by id
router.get('/:id', async (req, res) => {
  const productById = await Product.find({ _id: req.params.id });

  res.json(productById);
});

//Delete product
router.delete('/:id', async (req, res) => {
  const removedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!removedProduct) return res.send('Product not  found');

  res.send('Product has been deleted');
});

//Update product
router.patch('/:id', async (req, res) => {
  try {
    const productUpdate = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { title: req.body.title }, $set: { price: req.body.price } }
    );

    res.json(productUpdate);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
