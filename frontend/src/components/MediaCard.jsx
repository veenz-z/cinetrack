import { Link } from 'react-router-dom';

function MediaCard({ item, actions }) {
    return (
        <div
            style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                width: '160px',
            }}
        >
            <Link to={`/title/${item.media_type}/${item.tmdb_id}`}>
                {item.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                        alt={item.title}
                        style={{ width: '100%', display: 'block', aspectRatio: '2/3', objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        style={{
                            aspectRatio: '2/3',
                            background: 'var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-muted)',
                            fontSize: '12px',
                        }}
                    >
                        No image
                    </div>
                )}
                <p style={{ padding: '8px 10px 0', margin: 0, fontWeight: 600, fontSize: '14px' }}>
                    {item.title}
                </p>
            </Link>
            <div style={{ padding: '8px 10px 10px' }}>{actions}</div>
        </div>
    );
}

export default MediaCard;

//Why the actions prop? Home needs an "Add to Watchlist" button/ Watchlist needs a status dropdown + Remove button
// different controls per page same card shell
// Passing them as a prop keeps one component doing both instead of duplicating the whole card twice and waste usage
