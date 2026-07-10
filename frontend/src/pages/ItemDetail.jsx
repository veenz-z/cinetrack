import { useState, useEffect } from 'react'; //use state for keeping data/ useEffect for getting info from back while page is loading
import { useParams } from 'react-router-dom'; // splits parameters using : / gives json
import { getTMDBDetails } from '../api/tmdb'; // the api req we made before for getting details

function ItemDetail() { // the whole component
    const { type, id } = useParams();// gets url parameters
    const [item, setItem] = useState(null); // holds  moovie info
    const [loading, setLoading] = useState(true); // loading is happening

    useEffect(() => { // this Hook starts when page loads
        setLoading(true); // loading
        getTMDBDetails(type, id)// getting info
            .then(setItem) // sets the res
            .finally(() => setLoading(false)); // resets the loading state
    }, [type, id]); // but if the type or id changes the page has to reload and gets the info again
    // it calls : Dependency Array

    if (loading) return <p>Loading...</p>;
    if (!item) return <p>Not found.</p>;

    const trailer = item.videos?.results?.find((v) => v.type === 'Trailer');
    //checks if item has video type of trailer to show it or not
    // the "?" makes the program prevent from crashing

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '32px' }}>
                {item.poster_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        alt={item.title || item.name}
                        style={{ width: '220px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}
                    />
                )}
                <div style={{ flex: 1, minWidth: '280px' }}>
                    <h1 style={{ fontSize: '28px', marginBottom: '12px' }}>{item.title || item.name}</h1>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{item.overview}</p>
                </div>
            </div>

            {trailer && (
                <div>
                    <h3 style={{ marginBottom: '12px' }}>Trailer</h3>
                    <iframe
                        width="100%"
                        height="450"
                        style={{ maxWidth: '800px', borderRadius: 'var(--radius)', border: 'none' }}
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title="Trailer"
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    );
}

export default ItemDetail; // exporting to use