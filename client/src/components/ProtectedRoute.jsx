import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * 
 * Wraps a route to enforce authentication and optional role requirements.
 * - If not authenticated → redirect to /login
 * - If authenticated but wrong role (e.g. user trying /admin) → redirect to /dashboard
 * 
 * @param {ReactNode} children  — The component to render if access is granted
 * @param {'user'|'admin'} role — Optional required role
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the attempted location for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'admin' && !isAdmin) {
    // User tried to access admin area — send them to their own dashboard
    return <Navigate to="/dashboard" replace />;
  }

  if (role === 'user' && isAdmin) {
    // Admin tried to access user dashboard — send them to admin dashboard
    return <Navigate to="/admin" replace />;
  }

  return children;
}
