import { Navigate } from 'react-router-dom'; // a component from react router that redirects user from page to another
import { useAuth } from '../context/AuthContext'; //the context from AuthContext.jsx

function hasStoredSession() {
    return localStorage.getItem('token') && localStorage.getItem('user');
}

function ProtectedRoute({ children }) { // in here children is = <WatchlistPage/>
    const { user, loading } = useAuth(); // getting info by getting user and loading from context

    if (loading) return <div>Loading...</div>; // showing while loading

    // After login/register, navigate() can run before React applies setUser()
    // localStorage is updated synchronously in loginUser() so check it as a fallback
    if (!user && !hasStoredSession()) {
        return <Navigate to="/login" replace />; // if user is null we navigate back to login page
    }
    // replace means we dont go back we replace the route so when you press back it does not make a loop

    return children; // if login is true
}

export default ProtectedRoute; // we export this to use it across app

// sos
//if there is no user = redirect to /login instead of rendering the page
// logged-in user can see watchlist and profile
//every one can see login and register page
// we are protecting routes