const jwt = require('jsonwebtoken')


// Bara test för auth
exports.cookieJwtAuth = (req, res, next) => {

        if (req.cookies['auth-token-admin']) {

            const token = req.cookies['auth-token-admin']
    
            jwt.verify(token, process.env.SECRET_ADMIN, async (err, payload) => {
    
                if (err) {
                    res.json(err)
                } else {
                    next()
                    // vad som ska göras om man är admin
                }
            })
    
        } else if (req.cookies['auth-token-customer']) {
    
            const token = req.cookies['auth-token-customer']
    
            jwt.verify(token, process.env.SECRET_CUSTOMER, async (err, payload) => {
    
                if (err) {
                    res.json(err)
                } else {
                    next()
                    // res.send('Du är kund')
                    // vad som ska göras om man är kund
                }
            })
    
        } else {
            res.send('Du måste var inloggad eller admin')
        }
        next();
/*     } catch (err) {
        // deletes the cookie chosen
        clearCookie('auth-token-customer')
        clearCookie('auth-token-admin')
        res.status(202).send('You dont have the authorization to  visit this page. (Cookies are cleared)')
    } */

}
