// Lägga till produkter
app.post('/', (req, res) => {

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
app.get('/', async (req, res) => {
    const products = await Product.find({}).populate('product')
    console.log(products)
    res.json(products)
})