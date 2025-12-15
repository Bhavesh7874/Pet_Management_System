import { useState, useContext } from 'react';
import Snackbar from '../../../shared/components/Snackbar';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch {
            setSnackbarMsg('Invalid email or password');
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <Snackbar
                message={snackbarMsg}
                color="red"
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
            />
            <h1 className="auth-title">Welcome Back</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                Please enter your details to sign in.
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label className="label">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        placeholder="e.g., user@example.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    style={{ marginTop: '1rem', padding: '1rem' }}
                >
                    Sign In
                </button>
                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
                </div>
            </form>
        </>
    );
};

export default Login;
