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

    // If boolean 'checkEmail' is true (if email inserted already exists in database)
    if (!checkEmail) {

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

                    // Sets the password to hash from BCrypt
                    password: hash,
                    name: req.body.name,

                    // Sets 'customer' as default value to role
                    // req.body.role can change the role to admin från insomnia/postman
                    role: 'customer',
                    adress: {
                        street: req.body.adress.street,
                        zip: req.body.adress.zip,
                        city: req.body.adress.city
                    },
                    // Sets the orderHistory to an empty array
                    orderHistory: []
                })

                // Slänga in check av lösen?

                // Saves the newUser-document to database with .save-method
                newUser.save((err) => {
                    if (err) {
                        res.json(err)
                    } else {
                        res.status(201).json(newUser)
                    }
                })


            }
        })
    } else {

        res.send({ msg: `The email is already registered` })
    }


})


module.exports = router;
