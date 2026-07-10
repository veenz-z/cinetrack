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

    return ( // web look
        <div style={{ maxWidth: '360px', margin: '80px auto', padding: '0 24px' }}>
            <div
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    padding: '32px',
                    boxShadow: 'var(--shadow)',
                }}
            >
                <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>Log In</h1>
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
                    {error && <p style={{ color: 'var(--color-danger)', fontSize: '14px' }}>{error}</p>}
                    <button type="submit" disabled={isSubmitting} style={{ width: '100%', marginTop: '8px' }}>
                        {isSubmitting ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                    No account? <Link to="/register" style={{ color: 'var(--color-primary)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login; // export to use across router