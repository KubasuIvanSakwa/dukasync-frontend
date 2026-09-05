import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../zustand/store';

const AdminRoute = () => {
    const { isAuthenticated, user } = useAuthStore();

    // If not logged in, send to auth page
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;