// Importing JSON Web Token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Evalutes if a cookie with the name 'auth-token' exists
    if (req.cookies['auth-token']) {

        // const token = req.cookies['auth-token']
        const token = req.cookies['auth-token']['token']

        // Evaluates if the provided token has the same password as environment variable 'SECRET_AUTH'
        jwt.verify(token, process.env.SECRET_AUTH, async (err, payload) => {
            // Evalutates if an error occured with the validation
            if (err) {
                res.json(err);
            
            // If no error occured with the validation
            } else {
                // Continue with the next route
                next();
            };
        });

    // If none of the cookies can be found
    } else {
        res.status(401).send({msg: 'Du måste var inloggad eller admin'})
    };
}