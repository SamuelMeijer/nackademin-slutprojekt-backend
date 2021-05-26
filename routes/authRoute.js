// Imports
const mongoose = require('mongoose');
const router = require('express').Router();

// Importing userRoute and User-model
const User = require('../models/User');
// TODO REMOVE? Not used in the application
const userRoute = require('../routes/userRoute')

// Importing cookie-parser
const cookieParser = require('cookie-parser');
// Used to access req.cookies
router.use(cookieParser())

// Importing bcrypt
const bcrypt = require('bcrypt');

// Importing JSON Web Token
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    // Searching for a user in the User-collection in the database with an email corresponding to the email provided by the request
    const user = await User.findOne({ email: req.body.email })

    // Evalutes if a user was found
    if (user) {
        // Comparing if the password provided by the request is the same as the password saved in the database
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            // Evalutes if an error occured while comparing passwords
            if (err) {
                // If an error occured, respond with an error-message
                res.json(err)
            }

            // Evaluates if the compared passwords match
            if (result === true) {
                // Generating a payload that will be used in a JSON Web Token
                const payload = {
                    // Issued by
                    iss: 'sinus',
                    // User-ID
                    uid: user._id
                }

                // Genereates a JSON Web Token containing the payload and SECRET with a lifetime of 1 hour
                const token = jwt.sign(payload, process.env.SECRET_AUTH, { expiresIn: "1h" });

                // Initiating an object containing the generated token and the userData provided by the database 
                const responseBody = {
                    token: token,
                    user: {
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        adress: user.adress
                    }
                };
                
                // Generating a cookie called 'auth-token' containing the object reffered to by 'responseBody'
                res.cookie('auth-token', responseBody)
                // Sending the object referred to by responseBody to the client
                res.send(responseBody);

            // If the compared password does not match
            } else {
                res.status(403).send('The provided email or password is incorrect')
            }
        })
    // If no user was found with the provided email
    } else {
        res.status(404).send('No user exists with the provided email')
    }
})

// TODO: Remove? Not used in application
// Loggar ut användare
router.delete('/',  (req, res) => {
    //const user =  User.findOne({ email: req.body.email })
    res.status(202).clearCookie('auth-token').send(`Du har loggat ut!`)
})

module.exports = router;