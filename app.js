const express = require('express');
const app = express();

// mongoose
const mongoose = require('mongoose');
// jsonWebToken
const jwt = require('jsonwebtoken');
// cookie-parer
const cookieParser = require('cookie-parser');
// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;


// Importera models från modules
const User = require('./modules/user')
const Product = require('./modules/product')

// Import routes
// const productRoute = require('./routes/')


// Dotenv behöver inte läggas i någon variabel. 
// Istället kommer vi åt objeteket process.env som i sin tur innehåller egenskapernar i .env-filen
require('dotenv').config()

// För att kunna köra put och post req. när vi skickar data
app.use(express.urlencoded({ extended: true }))

// Använda filerna i public
app.use(express.static('public'));

// Uppkoppling mot databasen sinus, hämtad från .env-filen
// Kan lägga till dbName som tredje argument
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true, dbName: 'sinusEmma' })

// Skapar variabel för uppkopplingen som skapades ovan
const db = mongoose.connection

// Vid problem att ansluta till databasen
db.on('error', (err) => {
    console.error(err)
})

// Öppnar upp anslutning till datapasen
db.once('open', () => {
    console.log('Connected to database')
})

// app.use('/products', productsRoute)


// For customers
app.post('/api/register', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            res.json(err)
        } else {
            const newUser = new User({

                email: req.body.email,
                password: hash,
                name: req.body.name,
                role: 'customer', // or customer

                adress: {
                    street: req.body.street,
                    zip: req.body.zip,
                    city: req.body.city
                },
                orderHistory: []
            })

            // Sparar användaren
            newUser.save((err) => {
                if (err) {
                    res.json(err)
                } else {
                    res.json(newUser)
                }
            })
        }
    })

})


app.post('/api/auth', async (req, res) => {

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



// Lägga till produkter
app.post('/api/products', (req, res) => {

    const newProduct = new Product({
        title: req.body.title,
        price: req.body.price,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        imgFile: req.body.imgFile
    })

    // Sparar användaren
    newProduct.save((err) => {
        if (err) {
            res.json(err)
        } else {
            res.json(newProduct)
        }
    })
})

// Visar alla produkter
app.get('/api/products', async (req, res) => {
    const products = await Product.find({}).populate('product')
    console.log(products)
    res.json(products)
})

/* app.get('/delete') */

// Visar specifik produkt
/* app.get('/api/products/:id', async(req, res) => {
    const products = await Product.find({ uid: _}).populate('product')
    console.log(products)
res.json(products)
}) */




module.exports = app