import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-slate-50">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500 mb-4"></div>
          <p class="text-lg font-medium text-slate-600">Loading your profile safely...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if user session is not active
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user's role is not authorized, redirect to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
