import { useState } from 'react'; // keeping info of this page
import { useNavigate, Link } from 'react-router-dom'; // navigate to other pages
import { login } from '../api/auth'; // this page doesnt need to write fetch()
import { useAuth } from '../context/AuthContext'; // to handel loginUser()

function Login() {
    const [email, setEmail] = useState(''); // gets frm user
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // if anyy errs
    const [isSubmitting, setIsSubmitting] = useState(false); //submit state is false

    const { loginUser } = useAuth(); // we just need loginUser from context
    const navigate = useNavigate(); // we get navigate from useNavigate to use later

    async function handleSubmit(e) { // when form gets submitted :
        e.preventDefault(); // preventing reloading
        setError(''); // clearing errs state
        setIsSubmitting(true); // set submission to true

        try {
            const data = await login(email, password); // login req / res in data
            loginUser(data.user, data.token); // token and user saves in local storage
            navigate('/', { replace: true }); // go to home after login
        } catch (err) { // if any errors
            setError(err.message);
        } finally { // this gets run anyway
            setIsSubmitting(false); // turn back the submission mode to false
        }
    }

    return ( // website look
        <div>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
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
                    {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
            </form>
            <p>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login; // export to use across router