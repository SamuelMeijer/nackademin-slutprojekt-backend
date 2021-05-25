const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User');
const userRoute = require('../routes/userRoute')

// cookie parser - module?
const cookieParser = require('cookie-parser');
// Behövs för att kunna hämta req.cookies
// Skapar middleware?
router.use(cookieParser())

// bcrypt middleware/module?
const bcrypt = require('bcrypt');

// json web token middleware/module?
const jwt = require('jsonwebtoken');


router.post('/', async (req, res) => {

    // Söker efter användarnamnet i USER-collectionen
    const user = await User.findOne({ email: req.body.email })

    // Om användaren finns (user == true)
    if (user) {

        // Kolla om lösenordet stämmer
        // Jämför första och andra parametern
        // Ingen callback här!!!
        bcrypt.compare(req.body.password, user.password, function (err, result) {

            // Vid fel
            if (err) {
                res.json(err)
            }

            // Om lösenorden matchar (result !== false, resultatet är inte falskt, eeh?)
            // KOLLA DETTA IMORGON MED SAMUEL!!! :D
            if (result !== false) {

                const payload = {

                    // Utfärdat av
                    iss: 'sinus',
                    // Utgångsdatum - en timme i detta fall
                    // exp: Math.floor(Date.now() / 1000) + (60 + 60),
                    // Kanske senare?
                    // Lägger till användare hämtat från user._id
                    uid: user._id
                }

                const token = jwt.sign(payload, process.env.SECRET_AUTH, { expiresIn: "1h" });
                    
                // User-information syns i jwt.io, ok?
                    
                    const responseBody = {
                        token: token,
                        user: {
                            email: user.email,
                            name: user.name,
                            // role: user.role,
                            adress: user.adress
                        }
                    };
                    
                    res.cookie('auth-token', responseBody)
                    res.send(responseBody);
                    // res.json istället?
                  
                /*
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
                */

            } else {
                res.send('Användarnamn eller lösenord stämmer ej!')
            }
        })
    } else {
        res.send('Hittar ej användare')
    }
})



// ***** Testing authentication ******
const jwtAuthentication = require('../middleware/jwtAuthentication');

router.get('/', jwtAuthentication, (req, res, next) => {
    res.send('Hejhej')
})

/* ***** FLYTTAR TILL MIDDLEWARE *****
// Bara test för auth
router.get('/', (req, res) => {

    // deletes the cookie chosen
    // res.status(202).clearCookie('auth-token-customer').send('admin cookie is cleared')

    if (req.cookies['auth-token-admin']) {

        const token = req.cookies['auth-token-admin']

        jwt.verify(token, process.env.SECRET_ADMIN, async (err, payload) => {

            if (err) {
                res.json(err)
            } else {
                res.send('Du är en admin')
                // vad som ska göras om man är admin
            }
        })

// Testing authentication
const jwtAuthentication = require('../middleware/jwtAuthentication');

router.get('/', jwtAuthentication, (req, res, next) => {
    res.send('Hejhej')
})
***** FLYTTAR TILL MIDDLEWARE ***** */

// Loggar ut användare
router.delete('/',  (req, res) => {
    //const user =  User.findOne({ email: req.body.email })
    res.status(202).clearCookie('auth-token').send(`Du har loggat ut!`)
})



module.exports = router;