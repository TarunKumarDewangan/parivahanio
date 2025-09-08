import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth(); // Get user from secure context

  // Not logged in -> go to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in, but role is not allowed for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a default dashboard page
    return <Navigate to="/user" replace />;
  }

  // User is authenticated and has the correct role
  return children;
};

export default ProtectedRoute;
