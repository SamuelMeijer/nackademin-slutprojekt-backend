const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

//import routes
const productRoute = require('./routes/productRoute');
const orderRoute = require('./routes/orderRoute')
const authRoute = require('./routes/authRoute')


//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Routes
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/auth', authRoute)

//Connect to DB
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: 'sinustest',
  })
  .then(() => {
    console.log('Connected to db');
  })
  .catch((err) => {
    console.log(err);
  });

/* app.post('/api/products', (req, res) => {
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
}); */

module.exports = app;
