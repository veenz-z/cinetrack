import { useState } from 'react';  // keeping info of this page
import { useNavigate, Link } from 'react-router-dom'; // navigate to other pages
import { register } from '../api/auth'; // this page doesnt need to write fetch()
import { useAuth } from '../context/AuthContext'; // to handel loginUser()

function Register() { // this is a react component
    const [username, setUsername] = useState(''); // user fills in all of these inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // if anything is wrong
    const [isSubmitting, setIsSubmitting] = useState(false);// when submits this turns true

    const { loginUser } = useAuth(); // using the context we made we just get userLogin in here
    const navigate = useNavigate(); // we get user navigate here

    async function handleSubmit(e) { // this runs when user submits
        e.preventDefault(); // preventing reloading
        setError(''); // clear error state to null
        setIsSubmitting(true); // the submission state is now true

        try {
            const data = await register(username, email, password); // sending req / res saves is data
            loginUser(data.user, data.token); // saves user and token in local storage and updates context => instant login
            navigate('/watchlist'); // you see watchlist page after login
        } catch (err) { // if any errs
            setError(err.message);
        } finally { // this always runs
            setIsSubmitting(false); // we need our button to be activated
        }
    }

    return ( // this is our page look
        <div>
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Register'}
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default Register; // exporting to use it in router

// ki ki ki rrraaaah
// each input is a controlled component
// its value lives in React state not the DOM
// react owns the data
// the input just reflects it back