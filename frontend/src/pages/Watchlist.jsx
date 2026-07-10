import { useState, useEffect } from 'react'; //for keeping this pages info and data
import { getWatchlist, updateWatchlistItem, removeFromWatchlist } from '../api/watchlist'; //the fetch requests that we made before
import { Link } from 'react-router-dom';

function Watchlist() { //first component (the whole watchlist)
    const [items, setItems] = useState([]); // saves all of the items in the watchlist
    const [filter, setFilter] = useState('all'); //for filtering (later maybe : watched or completed)
    const [loading, setLoading] = useState(true); // showing loading
    const [error, setError] = useState(''); // for showing any kind of error

    useEffect(() => {
        loadWatchlist();
    }, []); // empty array means only render this once

    async function loadWatchlist() { // getting watchlist info from backend
        setLoading(true); // start the loading
        try {
            const data = await getWatchlist(); // getWatchlist is api req made before saves res in data
            setItems(data); //sets items into our array
        } catch (err) { // if anything goes wrong
            setError(err.message);
        } finally { // this runs anyways
            setLoading(false); // sets back loading to off
        }
    }

    async function handleStatusChange(id, status) { // when select gets changed
        try {
            const updated = await updateWatchlistItem(id, { status }); // sending update req
            setItems(items.map((item) => (item.id === id ? updated : item))); // react maps through every item
            // if id==id update the stat / if not stays unchanged
        } catch (err) { // if any errs
            setError(err.message);
        }
    }

    async function handleRemove(id) { // when user wants to remove an item
        try {
            await removeFromWatchlist(id); // the api request we made before
            setItems(items.filter((item) => item.id !== id)); // removes the item by keeping every item that is
            // item.id != id
            // so now we have a new filtered list without the one we wanted to be removed
        } catch (err) { //catching any errs
            setError(err.message);
        }
    }

    const filteredItems = filter === 'all' ? items : items.filter((i) => i.status === filter);
    // if filter === all => shows everything
    // if filter === any status => shows only items with that status

    if (loading) return <p>Loading your watchlist...</p>; // this shows while loading

    return ( // website look
        <div>
            <h1>My Watchlist</h1>

            <div>
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('to_watch')}>To Watch</button>
                <button onClick={() => setFilter('watching')}>Watching</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {filteredItems.length === 0 ? (
                <p>Nothing here yet.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {filteredItems.map((item) => (
                        <div key={item.id} style={{ width: '150px' }}>
                            <Link to={`/title/${item.media_type}/${item.tmdb_id}`}>
                                {item.poster_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                                        alt={item.title}
                                        style={{ width: '100%' }}
                                    />
                                )}
                                <p>{item.title}</p>
                            </Link>
                            <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            >
                                <option value="to_watch">To Watch</option>
                                <option value="watching">Watching</option>
                                <option value="completed">Completed</option>
                            </select>
                            <button onClick={() => handleRemove(item.id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Watchlist; // exporting to use through router

