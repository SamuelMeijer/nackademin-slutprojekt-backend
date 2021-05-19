const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/user');


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

                email: req.body.email,
                password: hash,
                name: req.body.name,
                role: 'customer', // or customer

                adress: {
                    street: req.body.street,
                    zip: req.body.zip,
                    city: req.body.city
                },
                orderHistory: []
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
