const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Evalutes if admin-auth
    if (req.cookies['auth-token']) {

        const token = req.cookies['auth-token']

        jwt.verify(token, process.env.SECRET_AUTH, async (err, payload) => {
            if (err) {
                res.json(err);
            } else {
                next();
                //res.send('Du är en admin')
                // vad som ska göras om man är admin
            };
        });

    // Evalutes if customer-auth
    /*  } else if (req.cookies['auth-token-customer']) {
        const token = req.cookies['auth-token-customer']
        jwt.verify(token, process.env.SECRET_CUSTOMER, async (err, payload) => {
            if (err) {
                res.json(err);
            } else {
                next();
                // res.send('Du är kund')
                // vad som ska göras om man är kund
            }
        });
        */
    // If none of the cookies can be found
    } else {
        res.send('Du måste var inloggad eller admin')
    };
}