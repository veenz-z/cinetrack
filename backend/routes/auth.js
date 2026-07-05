const express = require('express'); // using express for making router this time
const bcrypt = require('bcrypt'); // using this library for hashing passwords
const jwt = require('jsonwebtoken'); // this library for making jwt token
const pool = require('../db'); // the pool that wee made for running queries

const router = express.Router(); // creating a router

// POST (if: /api/auth/register)
router.post('/register', async (req, res) => {
    // this is async bc the function takes time so we need to use await here and there
    const { username, email, password } = req.body; // getting from front and destructing it to js obj

    if (!username || !email || !password) { // checking if everything is filled
        return res.status(400).json({ error: 'All fields are required' });
        // if not => (400, bad req) gets err
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10); // hashing pass with standard salt rond of 10

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, username, email`,
            [username, email, passwordHash]
        ); // running the query

        const user = result.rows[0]; // first user on row

        const token = jwt.sign( // making a jwt
            { id: user.id, username: user.username },//for this user
            process.env.JWT_SECRET,// and the secret for this token
            { expiresIn: '7d' } // obvious
        );

        res.status(201).json({ user, token }); // 201 created
    } catch (err) { // if anything wrong :
        if (err.code === '23505') { // this err code is for unique violation (the username/email already exists)
            return res.status(409).json({ error: 'Username or email already taken' }); // 409 conflict
        }
        console.error(err); // if any other errors :
        res.status(500).json({ error: 'Registration failed' }); //500 internal server error
    }
});

// POST (if: /api/auth/login)
router.post('/login', async (req, res) => {
    // req for login
    const { email, password } = req.body; // we are getting req from user

    if (!email || !password) { // checks if fiels are empty
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        // LITERALLY selects from users table an email equal to the email user gave
        const user = result.rows[0]; // and stores user in here

        if (!user) { // if not found => 401 Invalid credentials
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        // now using the same bcrypt system we compare the req pass to user found pass

        if (!passwordMatch) { // if not match => 401 Invalid credentials
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign( // if matches token gets created
            { id: user.id, username: user.username }, // for the same user
            process.env.JWT_SECRET, // here is the secret
            { expiresIn: '7d' }
        );

        res.json({ // then we gave back the user and token so it can be used
            user: { id: user.id, username: user.username, email: user.email },
            token,
        });
    } catch (err) { // if anything wrong :
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router; // we export the router so server can use it


// sup?
// we never store raw passwords , bcrypt.hash() scrambles it so even db leaks keeps passwords safe
// bcrypt.compare() checks the login info comparing o the hash but without any unscrambling
//jwt.sign() creates a signed token holding the userID, frontend keeps this and send it with each req as a proof of identity