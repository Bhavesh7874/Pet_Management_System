import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await register(name, email, password);
            // Set cookie for cross-port access
            document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=86400; SameSite=Lax`;
            window.location.href = 'http://localhost:3000/dashboard';
        } catch {
            alert('Registration failed');
        }
    };

    return (
        <>
            <h1 className="auth-title">Create Account</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                Join us to find your new best friend.
            </p>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label className="label">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        placeholder="John Doe"
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
                        placeholder="user@example.com"
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
                    Sign Up
                </button>
                <div className="auth-footer">
                    Already have an account? <a href="http://localhost:3001/login" className="auth-link register-btn">Sign In</a>
                </div>
            </form>
        </>
    );
};

export default Register;
