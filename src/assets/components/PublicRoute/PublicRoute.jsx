import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {

  const isAuthenticated = () => {
    const token = localStorage.getItem('token'); 
    return !!token; 
  };
  if (isAuthenticated()) {
    return <Navigate to="/" />; 
  }

  return children; 
};

export default PublicRoute;
