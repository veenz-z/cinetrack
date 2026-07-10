import {useState, useEffect} from 'react'; //use state for keeping data/ useEffect for getting info from back while page is loading
import {useParams} from 'react-router-dom'; // splits parameters using : / gives json
import {getTMDBDetails} from '../api/tmdb'; // the api req we made before for getting details

function ItemDetail() { // the whole component
    const {type, id} = useParams();// gets url parameters
    const [item, setItem] = useState(null); // holds  moovie info
    const [loading, setLoading] = useState(true); // loading is happening

    useEffect(() => {
        setLoading(true);
        getTMDBDetails(type, id)
            .then((data) => {
                if (!data || Object.keys(data).length === 0 || data.success === false) {
                    setItem(null);
                } else {
                    setItem(data);
                }
            })
            .catch((err) => {
                console.error(err);
                setItem(null);
            })
            .finally(() => setLoading(false));
    }, [type, id]);

    if (loading) {
        return (
            // the style is totally claudes idea
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                gap: '16px',
                color: 'var(--color-text-muted)'
            }}>
                {}
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid var(--color-border)',
                    borderTop: '3px solid var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}/>
                <p style={{margin: 0, fontWeight: 500, fontSize: '16px'}}>Loading...</p>
            </div>
        );
    }
    if (!item) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                gap: '12px',
                textAlign: 'center',
                padding: '24px'
            }}>
                {}
                <div style={{
                    //also claude
                    fontSize: '40px',
                    background: 'var(--color-surface)',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '8px'
                }}>
                    🎬
                </div>
                <h3 style={{margin: 0, color: 'var(--color-text)'}}>Title Not Found</h3>
                <p style={{margin: 0, color: 'var(--color-text-muted)', fontSize: '14px', maxWidth: '300px'}}>
                    We couldn't find the media item you're looking for. It may have been removed or the link is broken.
                </p>
            </div>
        );
    }

    const trailer = item.videos?.results?.find((v) => v.type === 'Trailer');
    //checks if item has video type of trailer to show it or not
    // the "?" makes the program prevent from crashing

    return (
        <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 24px'}}>
            <div style={{display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '32px'}}>
                {item.poster_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        alt={item.title || item.name}
                        style={{width: '220px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)'}}
                    />
                )}
                <div style={{flex: 1, minWidth: '280px'}}>
                    <h1 style={{fontSize: '28px', marginBottom: '12px'}}>{item.title || item.name}</h1>
                    <p style={{color: 'var(--color-text-muted)', lineHeight: 1.7}}>{item.overview}</p>
                </div>
            </div>

            {trailer && (
                <div>
                    <h3 style={{marginBottom: '12px'}}>Trailer</h3>
                    <iframe
                        width="100%"
                        height="450"
                        style={{maxWidth: '800px', borderRadius: 'var(--radius)', border: 'none'}}
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