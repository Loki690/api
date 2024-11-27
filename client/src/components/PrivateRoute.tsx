import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Outlet, Navigate, useParams } from 'react-router-dom';

const PrivateRoute: React.FC<{ adminOnly?: boolean }> = ({
  adminOnly = false,
}) => {
  const {
    isAuthenticated,
    user: currentUser,
    getSelf,
    signedOut,
  } = useAuthStore();
  const { projectId } = useParams();

  useEffect(() => {
    if (!isAuthenticated && !signedOut) {
      // Fetch user data if not already authenticated
      getSelf();
    }
  }, [isAuthenticated, signedOut, getSelf]);

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" />;
  }

  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  if (projectId && currentUser.project !== projectId) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
