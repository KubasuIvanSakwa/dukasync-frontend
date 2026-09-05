import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../zustand/store';

const PrivateRoute = () => {
    const { isAuthenticated } = useAuthStore();

    // If they aren't logged in, instantly kick them to the auth page
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    // If they are logged in, allow them to view the protected nested routes
    return <Outlet />;
};

export default PrivateRoute;