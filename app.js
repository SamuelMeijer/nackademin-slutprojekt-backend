const express = require('express');
const app = express();
const mongoose = require('mongoose');

// json web token
const jwt = require('jsonwebtoken');

require('dotenv').config();

//import routes
// ERSÄTT MED TIMS KOD
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Routes
// ERSÄTT MED TIMS KOD
app.use('/api/products', productRoute);
app.use('/api/register', userRoute)
app.use('/api/auth', authRoute)

//Connect to DB
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: 'sinusEmma',
  })
  .then(() => {
    console.log('Connected to db');
  })
  .catch((err) => {
    console.log(err);
  });



module.exports = app;