const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User');


// Till senare
// const Order = require('../models/order')

// json web token
const jwt = require('jsonwebtoken');

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

                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                name: req.body.name,
                // automatiskt att customer ska skrivas in, fråga Hans...
                role: 'customer', 
                adress: {
                    street: req.body.street,
                    zip: req.body.zip,
                    city: req.body.city
                },
                //importera orders här
                orderHistory: [{
                    type: new mongoose.Schema.Types.ObjectId,
                    ref: 'Order'
                }
                ]
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


// Hämtal alla användare
router.get('/', async (req, res) => {
    const users = await User.find({}).populate('user')
    console.log(users)
    res.json(users)
})

module.exports = router;
