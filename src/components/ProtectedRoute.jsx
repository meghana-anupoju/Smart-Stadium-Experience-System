import React from 'react';
import { useAuth } from '../store/AuthContext.jsx';
import AdminLogin from './AdminLogin.jsx';

/**
 * ProtectedRoute: Guards admin-only routes using Firebase Auth.
 * Shows AdminLogin if the user is not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { isAdmin, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="page-loader" role="status" aria-label="Checking authorization...">
        <div className="loader-spinner" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return children;
};

export default ProtectedRoute;
