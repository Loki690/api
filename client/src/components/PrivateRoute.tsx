import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Outlet, Navigate, useParams } from 'react-router-dom';

const PrivateRoute: React.FC<{ adminOnly?: boolean; exclude?: string[] }> = ({
  adminOnly,
  exclude,
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
      getSelf();
    }
  }, [isAuthenticated, signedOut, getSelf]);

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" />;
  }

  // Restrict routes for roles that aren't Admin or Head
  if (adminOnly && !['Admin', 'Head'].includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // Restrict specific routes for the Head role
  if (
    exclude &&
    currentUser.role === 'Head' &&
    exclude.some((path) => window.location.pathname.includes(path))
  ) {
    return <Navigate to="/unauthorized" />;
  }

  // Ensure projectId matches the user's assigned project
  if (projectId && currentUser.project !== projectId) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
