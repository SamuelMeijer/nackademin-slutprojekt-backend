const mongoose = require('mongoose');
const router = require('express').Router();

// Importing User-model
const User = require('../models/User');

// Cookie-parser
const cookieParser = require('cookie-parser');
router.use(cookieParser())

// BCrypt
const bcrypt = require('bcrypt');

// Sets the value 10 to saltRounds 
// - controls how much time is needed to calculate a single BCrypt hash
const saltRounds = 10;

// Route for register a new customer
router.post('/', async (req, res) => {

    // Checks in User-document if the email inserted aldready exists in the database
    const emailExists = await User.exists({ email: req.body.email })

    // If email doesn't exist in the database the followin code will run
    if (!emailExists) {

        // BCrypt-middleware encrypts the password inserted by the user, adds saltRounds-variable and returns an encrypted password: 'hash'
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {

            if (err) {
                res.json(err)
            } else {

                    // Creates a new document out of the User-model
                    const newUser = new User({

                        // Sets the _id to an ObjectId created by mongoose
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,

                        // Inserts encrypted password with hash
                        password: hash,
                        name: req.body.name,

                        // Sets 'customer' as the default value to role
                        // Can change the role to admin from mongoDB
                        role: 'customer',
                        adress: {
                            street: req.body.adress.street,
                            zip: req.body.adress.zip,
                            city: req.body.adress.city
                        },

                        // Sets the orderHistory to an empty array
                        orderHistory: []
                    })

                    // If the passwords entered matches
                    if (req.body.password == req.body.repeatPassword) {

                        // Saves the newUser-document to database with .save-method
                        newUser.save((err) => {
                            if (err) {
                                // If, for example, one or many fields are empty in the registration field/s
                                res.status(400).json(err)
                            } else {

                                // Redirects to /auth-end point for authorization
                                // This will automatically login the user 
                                // Status code 307 = temporarily 
                                res.redirect(307, '/api/auth');
                            }
                        })

                        // If the passwords entered doesn't match
                    } else {
                        res.status(409).send({ msg: 'Passwords does not match' })
                    }

            }
        })
        // If the email entered already is registered
    } else {
        res.status(409).send({ msg: `The email is already registered` })
    }
})


module.exports = router;
