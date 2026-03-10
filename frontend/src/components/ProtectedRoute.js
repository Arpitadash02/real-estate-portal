import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (user === undefined) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'broker' ? '/broker/dashboard' : '/customer/properties'} replace />;
  }
  return children;
};

export default ProtectedRoute;
