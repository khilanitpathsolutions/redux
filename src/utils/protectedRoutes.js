import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ expectedUserRole, isAdminOnly }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userRole = useSelector((state) => state.user.userRole);

  const isAuthorized = isLoggedIn && (userRole === expectedUserRole || (!isAdminOnly && userRole === 'admin'));

  return isAuthorized ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
