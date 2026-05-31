import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log("PrivateRoute location:", location);

  if (loading) {
    return <span className="loading loading-bars loading-lg"></span>;
  }

  if (!user) {
    return <Navigate to="/login" state={location.pathname }  replace />;
  }

  return children;
};

export default PrivateRoute;