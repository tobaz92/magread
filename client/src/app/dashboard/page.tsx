'use client';

import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Bienvenue, {user?.username}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;