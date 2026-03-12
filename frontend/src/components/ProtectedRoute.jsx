import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access to the child routes (Admin Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;
