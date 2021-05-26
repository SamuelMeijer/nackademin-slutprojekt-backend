const mongoose = require('mongoose');
const router = require('express').Router();

// Importing User-model
const User = require('../models/User');

// cookie parser - module?
const cookieParser = require('cookie-parser');
// Behövs för att kunna hämta req.cookies
// Skapar middleware?
router.use(cookieParser())
// bcrypt middleware/module?
const bcrypt = require('bcrypt');
// json web token middleware/module?
const jwt = require('jsonwebtoken');


const jwtAuthentication = require('../middleware/jwtAuthentication')

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


                // Saves the newUser-document to database with .save-method
                newUser.save(async (err) => {
                    if (err) {
                        res.json(err)
                    } else {

                        // If the newUser exist (if it was saved above with no errors)
                        if (newUser) {
                            // Adds information to the payload
                            const payload = {
                                iss: 'sinus',
                                uid: newUser.id
                            }

                            // Signs the token with payload-information
                            const token = jwt.sign(payload, process.env.SECRET_AUTH, { expiresIn: '1h' })

                            // Creates an object to assign to the cookie
                            const responseBody = {

                                // Collects the token signed above
                                token: token,
                                user: {
                                    email:  newUser.email,
                                    name: newUser.name,
                                    role: newUser.role,
                                    adress: {
                                        street: newUser.street,
                                        zip: newUser.zip,
                                        city: newUser.city
                                    }
                                }
                            }
                            // Saves responseBody to cookie with the name 'auth-token'
                            res.cookie('auth-token', responseBody)

                        }
                    }

                    // Collects the token in 'auth-token'-cookie to a variable
                    const loginToken = req.cookies['auth-token']['token']

                    // Verifies
                    jwt.verify(loginToken, process.env.SECRET_AUTH, (err, payload) => {
                        if (err) {
                            res.json(err)
                        } else {
                            // Checks if the passwords entered matches
                            if (req.body.password == req.body.repeatPassword) {
                                // Creates a variable for the 'auth-token'-cookie
                                const loginAuth = req.cookies['auth-token']
                                console.log(loginAuth)
                                res.status(201).json(loginAuth)
                            } else {

                                res.status(409).send('Passwords entered does not match')
                            }

                        }
                    })




                })
            }
        })
    } else {
        res.send({ msg: `The email is already registered` })
    }


})


module.exports = router;
