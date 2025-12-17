import { useRoutes } from 'react-router-dom';
import Dashboard from '../features/dashboard/DashboardPage';
import AdminDashboard from '../features/dashboard/AdminDashboardPage';
import AddPet from '../features/dashboard/AddPet';
import EditPet from '../features/dashboard/EditPet';

const AppRoutes = () => {
    return useRoutes([
        { path: '/', element: <Dashboard /> },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/admin', element: <AdminDashboard /> },
        { path: '/admin/add-pet', element: <AddPet /> },
        { path: '/admin/edit-pet/:id', element: <EditPet /> },
    ]);
};

export default AppRoutes;
