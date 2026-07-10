import { Link } from 'react-router-dom';

function MediaCard({ item, actions }) {
    return (
        <div
            style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
            }}
        >
            {}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Link
                    to={`/title/${item.media_type}/${item.tmdb_id}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
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
                                width: '100%',
                                color: 'var(--color-text-muted)',
                                fontSize: '12px',
                            }}
                        >
                            No image
                        </div>
                    )}
                    <p style={{ padding: '8px 10px 10px', margin: 0, fontWeight: 600, fontSize: '14px', flexGrow: 1 }}>
                        {item.title}
                    </p>
                </Link>
            </div>

            {}
            <div style={{ padding: '8px 10px 10px', marginTop: 'auto' }}>
                {actions}
            </div>
        </div>
    );
}

export default MediaCard;