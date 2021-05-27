// Importing JSON Web Token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Evalutes if a cookie with the name 'auth-token' exists
    if (req.cookies['auth-token']) {

        // Accessing the property 'token' of the object stored in a cookie with the name 'auth-token'
        const token = req.cookies['auth-token']['token']

        // Evaluates if the provided token has the same password as environment variable 'SECRET_AUTH'
        jwt.verify(token, process.env.SECRET_AUTH, async (err, payload) => {
            // Evalutates if an error occurred with the validation
            if (err) {
                res.json(err);
            
            // If no error occurred with the validation
            } else {
                // Continue with the next route
                next();
            };
        });

    // If no cookie with the name of 'auth-token' can be found
    } else {
        res.status(401).send({msg: 'Du måste var inloggad eller admin'})
    };
}