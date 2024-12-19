import { Navigate } from "react-router-dom";
import React from "react";

function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('accessToken') !== null;
  const isSuperuser = sessionStorage.getItem('is_superuser') === 'true';

  if (isAuthenticated) {
    if (isSuperuser) {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
