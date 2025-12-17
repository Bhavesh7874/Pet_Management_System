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
                window.location.href = 'http://localhost:3003/admin';
            } else {
                window.location.href = 'http://localhost:3003/dashboard';
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
            <p className="auth-subtitle">
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
                    className="btn btn-primary w-full mt-4 p-4"
                >
                    Sign In
                </button>
                <div className="auth-footer">
                    Don't have an account? <a href="http://localhost:3001/register" className="auth-link register-btn">Create Account</a>
                </div>
            </form>
        </>
    );
};

export default Login;
