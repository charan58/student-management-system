import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { loginStatus } = useContext(AuthContext);

  if (!loginStatus) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;