const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/user');
const userRoute = require('./userRoute')

// cookie parser
const cookieParser = require('cookie-parser');
// Behövs för att kunna hämta req.cookies
router.use(cookieParser())


// bcrypt 
const bcrypt = require('bcrypt');

// json web token
const jwt = require('jsonwebtoken');
const app = require('../app');

// const jwtAuth = require('../middleware/cookieJwtAuth')




// Bara test för auth
router.get('/', /* jwtAuth, */ (req, res) => {
    try {
        res.send('hello, det fungerar')
    } catch (err) {
        res.send(err)
    }

})





module.exports = router;
