import { useState } from 'react';  // for making states of the page
import { Link } from 'react-router-dom'; // for going to a specific movie info page
import { searchTMDB } from '../api/tmdb'; // function made before (get)
import { addToWatchlist } from '../api/watchlist'; // function made before (post)
import { useAuth } from '../context/AuthContext'; // to check login
import MediaCard from '../components/MediaCard';


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

    return ( // web page
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Find your next watch</h1>

            <form
                onSubmit={handleSearch}
                style={{ display: 'flex', gap: '10px', maxWidth: '480px', marginBottom: '24px' }}
            >
                <input
                    type="text"
                    placeholder="Search movies or shows..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ marginBottom: 0 }}
                />
                <button type="submit" disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </form>

            {message && (
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>{message}</p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {results.map((item) => (
                    <MediaCard
                        key={item.tmdb_id}
                        item={item}
                        actions={<button onClick={() => handleAdd(item)} style={{ width: '100%' }}>Add to Watchlist</button>}
                    />
                ))}
            </div>
        </div>
    );
}


export default Home; // exporting to se in router

