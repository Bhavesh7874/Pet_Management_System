import { useRoutes, Navigate } from 'react-router-dom';
import Login from '../features/auth/components/Login';
import Register from '../features/auth/components/Register';
import AuthPage from '../features/auth/AuthPage';

const AppRoutes = () => {
    return useRoutes([
        { path: '/', element: <Navigate to="http://localhost:3001/login" /> },
        {
            element: <AuthPage />,
            children: [
                { path: 'login', element: <Login /> },
                { path: 'register', element: <Register /> },
            ]
        },
    ]);
};

export default AppRoutes;
