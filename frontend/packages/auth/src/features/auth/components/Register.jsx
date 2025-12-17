import { useState, useContext } from 'react';
import Snackbar from '../../../shared/components/Snackbar';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            document.cookie = "token=dummy-token; path=/; domain=localhost";
            window.location.href = 'http://localhost:3000/dashboard';
        } catch (error) {
            setSnackbarMsg(error.response?.data?.message || 'Registration failed');
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
                Join our community and find your new best friend.
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label className="label">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        placeholder="e.g., John Doe"
                        required
                    />
                </div>
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
                    Create Account
                </button>
                <div className="auth-footer">
                    Already have an account? <a href="http://localhost:3001/login" className="auth-link register-btn">Sign In</a>
                </div>
            </form>
        </>
    );
};

export default Register;
