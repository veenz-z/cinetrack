import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logoutUser();
        navigate('/login');
    }

    return (
        <nav
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '16px 32px',
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            <Link to="/" style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>
                🎬 CineTrack
            </Link>

            {user ? (
                <>
                    <Link
                        to="/watchlist"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '8px 16px',
                            background: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius)',
                            textDecoration: 'none', // Removes the underline
                            fontWeight: 500,
                            fontSize: '14px',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                        }}
                    >
                        My Watchlist
                    </Link>

                    <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: '14px', alignSelf: 'center' }}>
            Hi, {user.username}
        </span>
                    <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--color-border)' }}>
                        Log Out
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
                        Log In
                    </Link>
                    <Link to="/register">
                        <button>Register</button>
                    </Link>
                </>
            )}
        </nav>
    );
}

export default NavBar;

// the whole thing is obvious im done commenting the same thing