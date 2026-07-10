const express = require('express'); // express library
const router = express.Router(); // making a new router for every movie related routes
// like in server if we call app.use('/api/tmdb', tmdbRoutes);
// we get : GET /api/tmdb/search   or    GET /api/tmdb/details/:type/:id

router.get('/search', async (req, res) => {// if the req was : GET /api/tmdb/search :
    const { query, type = 'multi' } = req.query;  //destructuring => this line is equal to :
    // const query = req.query.query;
    //const type = req.query.type;

    // default to multi so searches include both movies and TV shows

    if (!query) { // if query is empty
        return res.status(400).json({ error: 'Query parameter is required' }); // it's a bad request ( ͡ಠ ʖ̯ ͡ಠ )
    }

    try { //starting the connection with the tmdb
        //using try catch for : intent interruption / not responding API / wrong API key
        const url = `https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&api_key=${process.env.TMDB_API_KEY}`;
        // we are making the url in here
        // encodeURIComponent is making sure that the input query is using correct query style
        //process.env.TMDB_API_KEY is reading the api key from the .env file (without this tmdb will reject our req)
        const response = await fetch(url); // we are sending our req in here
        // what is fetch ? it sends a http req to tmdb : fetch -> tmdb server -> response
        const data = await response.json(); //tmdb gives us the req as a json

        const results = data.results
            .filter((item) => type !== 'multi' || item.media_type === 'movie' || item.media_type === 'tv')
            .map((item) => ({ // the results are mapped through every item in tmdb
            tmdb_id: item.id,
            title: item.title || item.name, // title is for movies, names are for series
            overview: item.overview,
            poster_path: item.poster_path,
            release_date: item.release_date || item.first_air_date,
            media_type: type === 'multi' ? item.media_type : type,
        })); //we get the result we want

        res.json(results); // and we convert it to a json and send it to front
    } catch (err) { // if any errors :
        console.error(err);
        res.status(500).json({ error: 'TMDB search failed' });
    }
});

router.get('/details/:type/:id', async (req, res) => {
    // this route is foe getting the full information on a movie/series
    const { type, id } = req.params;// extract a req like this : /details/movie/550 to:
    // {
    //     type:"movie",
    //
    //         id:"550"
    // }

    try {
        const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos`;
        // making url like before
        // append_to_response=videos : this gives us not only the film details but also the trailers.
        const response = await fetch(url); // getting or fetching the information
        const data = await response.json(); // making our res a json
        res.json(data); // sending it to frontend
    } catch (err) { // catching any errors
        console.error(err);
        res.status(500).json({ error: 'TMDB details fetch failed' });
    }
});

module.exports = router; // exporting the router to ue across the server


// heyyyyy
// in here we used proxy route instead of calling the tmdb straight from the react
//why :
// the logic is that if react calls the api directly, the api would be exposed to the browsers network tab for anyone
// routing it through express keeps it server-side only.