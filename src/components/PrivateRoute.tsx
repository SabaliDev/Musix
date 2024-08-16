import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Define the shape of your Redux state
interface RootState {
  auth: {
    token: string | null;
  };
}

const PrivateRoute: React.FC = () => {
  // Type the useSelector hook with the RootState type
  const { token } = useSelector((state: RootState) => state.auth);

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token is present, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
