import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;
