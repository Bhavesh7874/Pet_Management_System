import { Outlet } from 'react-router-dom';

const AuthPage = () => {
    return (
        <div className="auth-container">
            <div className="auth-card fade-in">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthPage;
