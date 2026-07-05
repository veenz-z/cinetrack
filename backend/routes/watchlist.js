const express = require('express'); // adding express library
const router = express.Router(); // creating a new router for all watchlist routes
const pool = require('../db'); // // connection to node-> postgresql -> run sql
const authMiddleware = require('../middleware/auth'); //adds authentication middleware (checks jwt/puts info in req)

router.use(authMiddleware); // you have to have the right token to use any of the CRUD

// GET all watchlist items for logged-in user (GET /api/watchlist)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query( // we want to run a query
            'SELECT * FROM watchlist WHERE user_id = $1 ORDER BY added_at DESC',
            // select from watchlist table everything where user id is same as the user logged-in
            //order by newest to oldest
            [req.user.id]
        );
        res.json(result.rows); // sends respond as json to react
    } catch (err) { // catch any fetching errors
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
});

// POST add new item  (POST /api/watchlist)
router.post('/', async (req, res) => {
    const { tmdb_id, media_type, title, poster_path } = req.body; //we get the movie as an object

    if (!tmdb_id || !media_type || !title) { // if anything is empty its a bad req (◡︵◡)
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try { //
        const result = await pool.query( // we are adding a new record
            `INSERT INTO watchlist (user_id, tmdb_id, media_type, title, poster_path)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            // put a new record in watchlist table (with given data and places )
            [req.user.id, tmdb_id, media_type, title, poster_path]  // and return th same record after inserting
        );
        res.status(201).json(result.rows[0]); // everything is ok
    } catch (err) {
        if (err.code === '23505') { // this error code is : Unique Constraint => in this case movie already exist
            return res.status(409).json({ error: 'Already in your watchlist' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// PATCH update status/rating/notes  (/api/watchlist/"any id")
router.patch('/:id', async (req, res) => { // new route
    // with /:id we have given a movie id to update information on
    const { status, rating, notes } = req.body; // the new information

    try {
        const result = await pool.query( // here is our new req query
            `UPDATE watchlist
             SET status = COALESCE($1, status),
                 rating = COALESCE($2, rating),
                 notes  = COALESCE($3, notes)
             WHERE id = $4 
               AND user_id = $5 RETURNING *`, // in here we make sure there are no confusion over whose record is being updated
            // COALESCE($1, status) : if new value exists, use it, if not, keep the last one
            [status, rating, notes, req.params.id, req.user.id] // we return the res
        );

        if (result.rows.length === 0) { // if there is no record to be updated
            return res.status(404).json({ error: 'Item not found' }); // 404 not found ಠ ͜ʖ ಠ
        }

        res.json(result.rows[0]); // if theres no problem we give the res as json
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// DELETE (/api/watchlist/"any id")
router.delete('/:id', async (req, res) => {
    // with /:id we have given a movie id to update information on
    try {
        const result = await pool.query(
            'DELETE FROM watchlist WHERE id = $1 AND user_id = $2 RETURNING *',
            //delete from watchlist table where id of the record is $1 and user d is $2
            [req.params.id, req.user.id] // we return the record
        );

        if (result.rows.length === 0) { // if there is no record to be deleted
            return res.status(404).json({ error: 'Item not found' }); // 404 not found 乁( ͡ಠ ʖ̯ ͡ಠ)ㄏ
        }

        res.json({ success: true }); // if whole thing worked out
    } catch (err) { // if anything goes wrong
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router; //we export this router to use all across the server


// this whole thing is CRUD system tied to a logged-in user
