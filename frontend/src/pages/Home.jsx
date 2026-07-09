import { useState } from 'react';  // for making states of the page
import { Link } from 'react-router-dom'; // for going to a specific movie info page
import { searchTMDB } from '../api/tmdb'; // function made before (get)
import { addToWatchlist } from '../api/watchlist'; // function made before (post)
import { useAuth } from '../context/AuthContext'; // to check login

function Home() { // start of the component
    const [query, setQuery] = useState(''); // the text inside of search box
    const [results, setResults] = useState([]); // the result gets stored in here
    const [isSearching, setIsSearching] = useState(false); //shows "is searching..."
    const [message, setMessage] = useState(''); // if any massage was needed to be shown

    const { user } = useAuth(); //getting user from context

    async function handleSearch(e) { // when submitting the search
        e.preventDefault(); // preventing reloading
        if (!query.trim()) return; // if the query is just spaces it detects and returns

        setIsSearching(true); // button turns to "searching..."
        setMessage(''); // massage gets cleared

        try {
            const data = await searchTMDB(query); // reeq to back / res saves in data
            setResults(data); // sets it
        } catch (err) { // if anything wrong
            setMessage('Search failed. Try again.');
        } finally { // this happens every time
            setIsSearching(false); // we need our button back
        }
    }

    async function handleAdd(item) { // add function
        if (!user) { // user have to be logged in
            setMessage('Log in to add items to your watchlist.');
            return;
        }

        try {
            await addToWatchlist(item); // this is a backend query
            setMessage(`Added "${item.title}" to your watchlist.`);
        } catch (err) { // if any erros
            setMessage(err.message);
        }
    }

    return ( // web page look
        <div>
            <h1>CineTrack</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search movies or shows..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">{isSearching ? 'Searching...' : 'Search'}</button>
            </form>

            {message && <p>{message}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {results.map((item) => (
                    <div key={item.tmdb_id} style={{ width: '150px' }}>
                        <Link to={`/title/${item.media_type}/${item.tmdb_id}`}>
                            {item.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                                    alt={item.title}
                                    style={{ width: '100%' }}
                                />
                            ) : (
                                <div style={{ height: '200px', background: '#ccc' }}>No image</div>
                            )}
                            <p>{item.title}</p>
                        </Link>
                        <button onClick={() => handleAdd(item)}>Add to Watchlist</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home; // exporting to se in router

