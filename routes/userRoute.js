const mongoose = require('mongoose');
const router = require('express').Router();

// Importing models
const User = require('../models/User');
const Order = require('../models/Order');


// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Route for register a new customer
router.post('/', async (req, res) => {

    // Checks in the User-model if the email inserted aldready exists
    const checkEmail = await User.exists({ email: req.body.email })
    
    // Encrypts the 
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {

        if (err) {
            res.json(err)
        } else {
   
            const newUser = new User({

                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                name: req.body.name,

                // Sets 'customer' as default value to role.
                role: 'customer',
                adress: {
                    street: req.body.street,
                    zip: req.body.zip,
                    city: req.body.city
                },
                orderHistory: []
            })

            if (checkEmail) {

                res.status(409).send({ msg: 'Email already exists' })

            } else {
                console.log(checkEmail)

                newUser.save((err) => {
                    if (err) {
                        res.json(err)
                    } else {
                        res.status(201).json(newUser)
                    }
                })
            }

        }
    })

})


module.exports = router;
