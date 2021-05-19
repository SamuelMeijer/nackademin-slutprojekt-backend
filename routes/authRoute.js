const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/user');
const userRoute = require('../routes/userRoute')
// cookie parser
const cookieParser = require('cookie-parser');

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
                    const token = jwt.sign(payload, process.env.SECRET_ADMIN)
                    res.cookie('auth-token-admin', token)
                    res.send(`Hej ${user.name}! Du är nu i ${user.role}-läge`)
                } else if (user.role == 'customer') {
                    const token = jwt.sign(payload, process.env.SECRET_CUSTOMER)
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



// Bara test för auth
router.get('/',  (req, res) => {
    if (req.cookies['auth-token-admin']) {
        const token =  req.cookies['auth-token-admin']

        jwt.verify(token, process.env.SECRET_ADMIN, async (err, payload) => {
            if (err) {
                res.json(err)
            } else {

                res.send('Du är en admin')
                // vad som ska göras om man är admin

            }
        })

    } else if (req.cookies['auth-token-user']) {

        const token = req.cookies['auth-token-user']

        jwt.verify(token, process.env.SECRET_USER, async (err, payload) => {
            if (err) {
                res.json(err)
            } else {

                res.send('DU är kund')
                // vad som ska göras om man är kund

            }
        })

    } else {
        res.send('Bara för inloggade')
    }
})





module.exports = router;
