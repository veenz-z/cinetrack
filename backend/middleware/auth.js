const jwt = require('jsonwebtoken'); // we nee jwt library

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization; // we get only Authorization from header

    if (!authHeader || !authHeader.startsWith('Bearer ')) { // is token sent currently ?
        return res.status(401).json({ error: 'No token provided' }); // this is outcome if token has any errors
    }

    const token = authHeader.split(' ')[1]; // separating the token from 'Bearer '

    try { // in case token is broken and prevent crashing
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // jwt was made in login with a secret
        // we are checking if the token is valid to the secret or not
        req.user = decoded;
        next(); // if every thing is ok we are here
    } catch (err) { // if not we get caught in here
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware; // this makes the Middleware usable all around the project

// hi
// the analogy here is like a secure party
// the frontman checks your id in the guests list (JWT)
// then in the party everybody knows who you are (req.user)
// not on the guest list = not invited (401)