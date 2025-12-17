import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../features/auth/AuthContext';
import { LogOut, User, LayoutDashboard, Heart } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('http://localhost:3001/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-content">
                    <Link to="http://localhost:3000" className="nav-logo">
                        <Heart size={32} color="var(--secondary)" fill="var(--secondary)" />
                        <span>PetAdopt</span>
                    </Link>

                    <div className="nav-links">
                        <Link to="http://localhost:3000" className="nav-link">
                            Find a Pet
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-md">
                                {user.role === 'admin' ? (
                                    <Link to="http://localhost:3003/admin" className="nav-link">
                                        <LayoutDashboard size={16} />
                                        Admin
                                    </Link>
                                ) : (
                                    <Link to="http://localhost:3000/dashboard" className="nav-link">
                                        <User size={16} />
                                        My Bucket
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-secondary"
                                >
                                    <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-md">
                                <Link to="http://localhost:3001/login" className="nav-link">
                                    Login
                                </Link>
                                <Link
                                    to="http://localhost:3001/register"
                                    className="btn signup-btn"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
