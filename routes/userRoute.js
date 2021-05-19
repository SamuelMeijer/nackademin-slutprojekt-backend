const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/user');


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