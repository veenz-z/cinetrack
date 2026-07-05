const express = require('express'); // we need express library
// express will ease the making of API
// acts like a manager
const cors = require('cors');// we need cors library
require('dotenv').config();// we need .env info

const app = express(); // we are making an app here
//and with express we run all the setting needed

app.use(cors()); // we use cors for our app so the whole apps backend stay connected to frontend
app.use(express.json()); // this is a Middleware (a step between req and res)
// checks info / make changes / catch errors / allow permission
// express.json() : json => js object

app.get('/', (req, res) => { // first route off the app 'GET'
    res.json({ message: 'CineTrack API is running' }); // if everything is on track we will see this massage as res
});

const PORT = process.env.PORT || 5000; // obvious

const authRoutes = require('./routes/auth'); // router for register/login
app.use('/api/auth', authRoutes); // divides the routes into register or login

const tmdbRoutes = require('./routes/tmdb');// router for search
app.use('/api/tmdb', tmdbRoutes); // divides the routes into search or search with details

const watchlistRoutes = require('./routes/watchlist'); // adds routes/watchlist.js
app.use('/api/watchlist', watchlistRoutes); // CRUD

app.listen(PORT, () => { // turning on the server
    // () =>{ is a call back function
    console.log(`Server running on port ${PORT}`);// if we succeed this function works and we see this message on console
});

// Aveen here again
// cors actually opens the door for our React app to make requests without getting blocked
//express.json automatically converts incoming json bodies into req.body