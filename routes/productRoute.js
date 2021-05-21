const mongoose = require('mongoose');
const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');

const jwtAuthentication = require('../middleware/jwtAuthentication')
// cookie parser
const cookieParser = require('cookie-parser');
// Behövs för att kunna hämta req.cookies
router.use(cookieParser())

//Post products
router.post('/', jwtAuthentication, async (req, res) => {
  const user = await User.findOne({ email: req.cookies['auth-token']["user"]["email"] })
  if(user.role=='admin'){  const newProduct = new Product({
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
  })}else{
    res.send('Ingen behörighet')
  }

  //console.log(req.body);
});

/* TESTING AUTH
//Get all products
router.get('/', async (req, res) => {
  const getAllProducts = await Product.find({}); /-* .populate('product'); *-/

  res.json(getAllProducts);
});
*/

//Get by id
router.get('/:id', async (req, res) => {
  const productById = await Product.find({ _id: req.params.id });

  res.json(productById);
});

//Delete product
router.delete('/:id',jwtAuthentication,  async (req, res) => {
  const removedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!removedProduct) return res.send('Product not  found');

  res.send('Product has been deleted');
});

//Update product
/* router.patch('/:id', async (req, res) => {
  try {
    const productUpdate = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { title: req.body.title }, $set: { price: req.body.price } }
    );

    res.json(productUpdate);
  } catch (err) {
    res.json({ message: err });
  }
}); */

//Update product
router.patch('/:id', jwtAuthentication, async (req, res) => {
  const user = await User.findOne({ email: req.cookies['auth-token']["user"]["email"] })
if(user.role=='admin'){
  const newProduct = {
    title: req.body.title,
    price: req.body.price,
    shortDesc: req.body.shortDesc,
    category: req.body.category,
    longDesc: req.body.longDesc,
    imgFile: req.body.imgFile,
  }
  const productUpdate = await Product.findByIdAndUpdate(req.params.id, newProduct);
  if (!productUpdate) return res.json('Something went wrong');

  productUpdate.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Your product has ben updated');
      res.json(newProduct);
    }
  });
}else{
  res.send("Ingen behörighet")
}

console.log(req.cookies['auth-token']["user"]);
//res.send('hejhå')

});

// ***** FRÅN EMMA-TEST ******
// Visar alla produkter
/* router.get('/', jwtAuthentication, async (req, res) => {

    const user = await User.findOne({ email: req.body.email })

    if (user.role == 'customer') {
        const products = await Product.find({}).populate('product')
        console.log(products)
        //res.json(products)
    } else if (user.role == 'admin'){
        res.send('Du är admin!')
    } else {
        res.send('Du måste vara inloggad kund för att se varorna')
    }

}) */


router.get('/', async (req, res) => {
  const allProducts = await Product.find({})
  res.json(allProducts)
})

module.exports = router;