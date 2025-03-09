// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/button.css'; 

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication and role data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
