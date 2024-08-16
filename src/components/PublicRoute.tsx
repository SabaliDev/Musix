import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

interface RootState {
  auth: {
    token: string | null;
  };
}

const PublicRoute: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
