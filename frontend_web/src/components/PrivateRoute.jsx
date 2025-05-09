import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config/api';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/user`, {
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        // Store user data in sessionStorage only if it's not already there
        if (!sessionStorage.getItem('userId')) {
          sessionStorage.setItem('userId', userData.id);
        }
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Clear any existing session data
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      // Clear any existing session data
      sessionStorage.clear();
    }
  };

  if (isAuthenticated === null) {
    // Still checking authentication status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 