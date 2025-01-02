import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteAdmin = ({ children }) => {
    const isAuthenticated = () => {
        const User = localStorage.getItem('user'); 
        if(User.role=='owner') return true;
        else return false;
    };
    
  if (!isAuthenticated()) {
    
    return <Navigate to="/home" />;
  }

  
  return children;
};

export default ProtectedRouteAdmin;
