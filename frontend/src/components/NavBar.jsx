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
        <nav style={{ display: 'flex', gap: '16px', padding: '16px', borderBottom: '1px solid #ccc' }}>
            <Link to="/">Home</Link>
            {user ? (
                <>
                    <Link to="/watchlist">My Watchlist</Link>
                    <span style={{ marginLeft: 'auto' }}>Hi, {user.username}</span>
                    <button onClick={handleLogout}>Log Out</button>
                </>
            ) : (
                <>
                    <Link to="/login" style={{ marginLeft: 'auto' }}>Log In</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}

export default NavBar;

// the whole thing is obvious im done commenting the same thing