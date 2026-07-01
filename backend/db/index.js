const { Pool } = require('pg'); // we only need the pool from pg library (Destructuring)
require('dotenv').config(); // we are getting .env info in here

const pool = new Pool({  //we get connected to a new string
    connectionString: process.env.DATABASE_URL, // we tell it which db to connect (from .env)
    ssl: { rejectUnauthorized: false }, //ssl is about encryption we need it for neon but we dont want to be encrypted
}); // now the pool is ready

module.exports = pool; // with this line we can use the pool that we made

// trust me this is me commenting not ai, lol.
//we are connecting our node.js to db in here
// a pool acts like small phone lines for my db
// instead of 1 connection per query
// it keeps few lines open and sends few at once if needed (makes connection faster)