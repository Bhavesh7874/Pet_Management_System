import { useRoutes } from 'react-router-dom';
import Home from '../features/public/Home';
import Login from '../features/auth/components/Login';
import Register from '../features/auth/components/Register';
import Dashboard from '../features/dashboard/DashboardPage';
import AdminDashboard from '../features/dashboard/AdminDashboardPage';
import AddPet from '../features/dashboard/AddPet';
import EditPet from '../features/dashboard/EditPet';
import PetDetails from '../features/pets/PetDetails';
import AuthPage from '../features/auth/AuthPage';

const AppRoutes = () => {
    return useRoutes([
        { path: '/', element: <Home /> },
        {
            element: <AuthPage />,
            children: [
                { path: 'login', element: <Login /> },
                { path: 'register', element: <Register /> },
            ]
        },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/admin', element: <AdminDashboard /> },
        { path: '/admin/add-pet', element: <AddPet /> },
        { path: '/admin/edit-pet/:id', element: <EditPet /> },
        { path: '/pets/:id', element: <PetDetails /> },
    ]);
};

export default AppRoutes;
