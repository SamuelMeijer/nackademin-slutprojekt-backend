const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/user');
const userRoute = require('../routes/userRoute')

// cookie parser
const cookieParser = require('cookie-parser');
// Behövs för att kunna hämta req.cookies
router.use(cookieParser())


// bcrypt 
const bcrypt = require('bcrypt');

// json web token
const jwt = require('jsonwebtoken');
const app = require('../app');


router.post('/', async (req, res) => {

    // Söker efter användarnamnet i USER-collectionen
    const user = await User.findOne({ email: req.body.email })

    // Om användaren finns (user == true)
    if (user) {

        // Kolla om lösenordet stämmer
        // Jämför första och andra parametern
        // Ingen callback!!!
        bcrypt.compare(req.body.password, user.password, function (err, result) {

            // Vid fel
            if (err) {
                res.json(err)
            }

            // Om lösenorden matchar (result !== false, resultatet är inte falskt, eeh?)
            if (result !== false) {

                const payload = {

                    // Utfärdat av
                    iss: 'sinus',
                    // Utgångsdatum - en timme i detta fall
                    exp: Math.floor(Date.now() / 1000) + (60 + 60),
                    // Kanske senare?
                    uid: user._id
                }

                if (user.role == 'admin') {
                    const token = jwt.sign(payload, process.env.SECRET_ADMIN/* , { expiresIn: '15m'} */)
                    res.cookie('auth-token-admin', token)
                    res.send(`Hej ${user.name}! Du är nu i ${user.role}-läge`)
                } else if (user.role == 'customer') {
                    const token = jwt.sign(payload, process.env.SECRET_CUSTOMER/* , { expiresIn: '15m'} */)
                    res.cookie('auth-token-customer', token)
                    res.send(`Hej ${user.name}! Du är nu i ${user.role}-läge`)
                } else {
                    res.send('Du har ej behörighet')
                }
            } else {
                res.send('Användarnamn eller lösenord stämmer ej!')
            }
        })
    }
})



module.exports = router;
