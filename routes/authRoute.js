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
        // Ingen callback här!!!
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
                    // Lägger till användare hämtat från user._id
                    uid: user._id
                }

                const token = jwt.sign(payload, process.env.SECRET_AUTH, { expiresIn: "15m" });
                    res.cookie('auth-token', token)
                    res.send(`Hej ${user.name}! Du är nu i ${user.role}-läge`)

            } else {
                res.send('Användarnamn eller lösenord stämmer ej!')
            }
        })
    }
})


// Testing authentication
const jwtAuthentication = require('../middleware/jwtAuthentication');

router.get('/', jwtAuthentication, (req, res, next) => {
    res.send('Hejhej')
})


// Loggar ut användare
router.delete('/',  (req, res) => {
    const user =  User.findOne({ email: req.body.email })
    res.status(202).clearCookie('auth-token').send(`Du har loggat ut som ${user.role}`)
})



module.exports = router;