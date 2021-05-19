const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/user');


// Till senare
// const Order = require('../models/order')

// json web token
const jwt = require('jsonwebtoken');
// cookie parser
const cookieParser = require('cookie-parser');

// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;



// For customers
router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            res.json(err)
        } else {
            const newUser = new User({

                _id: new mongoose.Schema.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                name: req.body.name,
                role: req.body.role, // or customer
                adress: {
                    street: req.body.street,
                    zip: req.body.zip,
                    city: req.body.city
                },
                //importera orders här
                /* orderHistory: [{
                    type: new mongoose.Schema.Types.ObjectId,
                    ref: 'Order'
                }
                ] */
            })

            // Sparar användaren
            newUser.save((err) => {
                if (err) {
                    res.json(err)
                } else {
                    res.json(newUser)
                }
            })
        }
    })

})

module.exports = router;
