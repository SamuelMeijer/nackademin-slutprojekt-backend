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
router.get('/', async (req, res) => {
  const allProducts = await Product.find({});
  res.json(allProducts);
});

//Post products. Post new products, access (with jwtAuthentication) for admin only.
router.post('/', jwtAuthentication, async (req, res) => {
  // Find and save user
  const user = await User.findOne({
    email: req.cookies['auth-token']['user']['email'],
  });
  // Check if user has the role of admin
  if (user.role == 'admin') {
    // If admin then post new product
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
  } else {
    res.send('No authorization');
  }
});

//Get by id
router.get('/:id', async (req, res) => {
  const productById = await Product.find({ _id: req.params.id });

  res.json(productById);
});

//Delete product
router.delete('/:id', jwtAuthentication, async (req, res) => {
  const removedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!removedProduct) return res.send('Product not  found');

  res.send('Product has been deleted');
});

// Patch for uppdating products, admin access only.
router.patch('/:id', jwtAuthentication, async (req, res) => {
  //Find and save user
  const user = await User.findOne({
    email: req.cookies['auth-token']['user']['email'],
  });
  //If admin, allow to update
  if (user.role == 'admin') {
    //To be able to update without filling in all fields
    //find and save current product in currentProduct
    const currentProduct = await Product.findById(req.params.id);
    //Find product by id and uppdate it to productUpdate
    //If a field is not filled, then use value from currentProduct
    const productUpdate = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title || currentProduct.title,
        price: req.body.price || currentProduct.price,
        shortDesc: req.body.shortDesc || currentProduct.shortDesc,
        longDesc: req.body.longDesc || currentProduct.longDesc,
        imgFile: req.body.imgFile || currentProduct.imgFile,
      },
      //new: true is a parameter that will show the updated object.
      { new: true }
    );

    if (!productUpdate) return res.json('No product found');

    productUpdate.save((err) => {
      if (err) {
        res.json({ msg: err });
      } else {
        console.log('Your product has ben updated');
        res.json(productUpdate);
      }
    });
  } else {
    res.send('No authorization');
  }

  //console.log(req.cookies['auth-token']['user']);
});

module.exports = router;
