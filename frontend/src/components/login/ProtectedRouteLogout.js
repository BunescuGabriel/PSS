import { Navigate } from "react-router-dom";
import React from "react";

function ProtectedRouteLogout({ children }) {
  const isAuthenticated = sessionStorage.getItem('accessToken') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }else {
        return children;
  }
}

export default ProtectedRouteLogout;
