const mongoose = require('mongoose');
const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');

//Import authentication file
const jwtAuthentication = require('../middleware/jwtAuthentication');

// cookie parser
const cookieParser = require('cookie-parser');

// Required to use req.cookies as middleware
router.use(cookieParser());

//Return list of all products.
//Find products, use empty object to find everything and save to allProducts
router.get('/', async (req, res) => {
  const allProducts = await Product.find({});
  res.json(allProducts);
});

//Post products. Post new products
//Access (with jwtAuthentication middleware) for admin only.
router.post('/', jwtAuthentication, async (req, res) => {
  // Find and save user
  const user = await User.findOne({
    //KOMMENTERA********************************************
    email: req.cookies['auth-token']['user']['email'],
  });
  // Check if user has the role of admin
  if (user.role == 'admin') {
    // If user is an admin then post new product
    // Save new product in newProduct that you create from Product Schema
    // and model. id will be assigned from mongoose.
    // req.body has parameters sent by client from POST request.
    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      price: req.body.price,
      shortDesc: req.body.shortDesc,
      longDesc: req.body.longDesc,
      imgFile: req.body.imgFile,
    });
    // Save new product with save() that will save to the DB.
    // Check for errors and if any, send error msg
    // Else return newProduct
    newProduct.save((err) => {
      if (err) {
        res.json({ msg: err });
      } else {
        res.json(newProduct);
      }
    });
  }
});

//Delete product
//Admin access only with jwtAuthentication middleware
router.delete('/:id', jwtAuthentication, async (req, res) => {
  const user = await User.findOne({
    // KOMMENTERA******************************************
    email: req.cookies['auth-token']['user']['email'],
  });
  // Check if user has role of admin.
  if (user.role == 'admin') {
    // If admin, find product by id and delete it
    const removedProduct = await Product.findByIdAndDelete(req.params.id);
    // If no product with clients sent id match
    if (!removedProduct) return res.send({ msg: 'No product found' });

    res.send({ msg: 'The product has been deleted' });
  }
});

// Patch for uppdating products, admin access only.
router.patch('/:id', jwtAuthentication, async (req, res) => {
  //Find and save user
  const user = await User.findOne({
    // KOMMENTERA******************************************
    email: req.cookies['auth-token']['user']['email'],
  });
  //If admin, allow to update
  if (user.role == 'admin') {
    //To be able to update without filling in all fields
    //find and save current product in currentProduct
    const currentProduct = await Product.findById(req.params.id);
    //Find product by id and uppdate it to productUpdate
    //If a field is not filled in, then use value from currentProduct
    const productUpdate = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title || currentProduct.title,
        price: req.body.price || currentProduct.price,
        shortDesc: req.body.shortDesc || currentProduct.shortDesc,
        longDesc: req.body.longDesc || currentProduct.longDesc,
        imgFile: req.body.imgFile || currentProduct.imgFile,
      },
      // {new: true} is a parameter that will return the updated object.
      { new: true }
    );

    if (!productUpdate) return res.json('No product found');
    // Save the updated product to the DB
    productUpdate.save((err) => {
      if (err) {
        res.json({ msg: err });
      } else {
        res.json(productUpdate);
      }
    });
  }
});

module.exports = router;
