import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, element }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
