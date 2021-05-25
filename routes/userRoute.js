const mongoose = require('mongoose');
const router = require('express').Router();

// Importing User-model
const User = require('../models/User');

// Importing BCrypt-module
const bcrypt = require('bcrypt');

// Sets the value 10 to saltRounds 
// - controls how much time is needed to calculate a single BCrypt hash
const saltRounds = 10;

// Route for register a new customer
router.post('/', async (req, res) => {

   // Checks in User-document if the email inserted aldready exists in the database
   const checkEmail = await User.exists({ email: req.body.email })
    console.log(checkEmail)

    // Encrypts the password inserted by the user, adds saltRounds-variable and adds encrypted password to the database
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {


        if (err) {
            res.json(err)
        } else {

            // Creates a new document out of the User-model
            const newUser = new User({

                // Sets the _id to an ObjectId created by mongoose
                _id: new mongoose.Types.ObjectId(),

                //req.body = accessing data from the server
                email: req.body.email,
                password: hash,
                name: req.body.name,

                // Enum limits the value of role to be either customer or adming
                // Sets 'customer' as default value to role
                role: 'customer',
                adress: {
                    street: req.body.street,
                    zip: req.body.zip,
                    city: req.body.city
                },
                orderHistory: []
            })

         

            // If boolean 'checkEmail' is true (if email inserted already exists in database)
            if (checkEmail) {

                
                res.status(409).send({ msg: 'Email already exists' })

            } else {

                newUser.save((err) => {
                    if (err) {
                        console.log(err)
                        res.json(err)
                    } else {
                        // res.status(201).json(newUser)
                        res.json(newUser)
                    }
                })
            }

        }
    })

})


module.exports = router;
