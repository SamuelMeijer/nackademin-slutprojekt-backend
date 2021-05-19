const mongoose = require('mongoose');
const router = require('express').Router();
// const Product = require('../models/product');

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
                    iss: 'ecUtb',
                    // Utgångsdatum - en timme i detta fall
                    exp: Math.floor(Date.now() / 1000) + (60 + 60),
                    // Kanske senare?
                    uid: user._id
                }

                const token = jwt.sign(payload, process.env.SECRET)
                res.cookie('auth-token', token)
                res.send(`Hej ${user.name}! Du är nu i ${user.role}-läge`)

            } else {
                res.send('Användarnamn eller lösenord stämmer ej!')
            }
        })
    }
})

module.exports = router;
