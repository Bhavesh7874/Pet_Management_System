import React, { Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

// Lazy load remotes
const Home = React.lazy(() => import('petApp/Home'));
const PetDetails = React.lazy(() => import('petApp/PetDetails'));
const Login = React.lazy(() => import('authApp/Login'));
const Register = React.lazy(() => import('authApp/Register'));
const Dashboard = React.lazy(() => import('dashboardApp/DashboardPage'));
const AdminDashboard = React.lazy(() => import('dashboardApp/AdminDashboardPage'));
const AddPet = React.lazy(() => import('dashboardApp/AddPet'));
const EditPet = React.lazy(() => import('dashboardApp/EditPet'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="flex justify-center p-10">Loading App...</div>}>
            {useRoutes([
                { path: '/', element: <Home /> },
                { path: '/login', element: <Login /> },
                { path: '/register', element: <Register /> },
                { path: '/dashboard', element: <Dashboard /> },
                { path: '/admin', element: <AdminDashboard /> },
                { path: '/admin/add-pet', element: <AddPet /> },
                { path: '/admin/edit-pet/:id', element: <EditPet /> },
                { path: '/pets/:id', element: <PetDetails /> },
                { path: '*', element: <Navigate to="/" /> }
            ])}
        </Suspense>
    );
};

export default AppRoutes;
