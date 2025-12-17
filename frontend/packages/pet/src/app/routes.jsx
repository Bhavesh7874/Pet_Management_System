import { useRoutes } from 'react-router-dom';
import Home from '../features/public/Home';
import PetDetails from '../features/pets/PetDetails';

const AppRoutes = () => {
    return useRoutes([
        { path: '/', element: <Home /> },
        { path: '/pets/:id', element: <PetDetails /> },
    ]);
};

export default AppRoutes;
