import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Komponen ini menerima 'children' sebagai prop. 
// 'children' adalah komponen halaman yang ingin kita lindungi (misalnya, <DashboardPage />)
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  // Jika tidak ada pengguna yang login, arahkan (redirect) ke halaman /login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Jika ada pengguna yang login, tampilkan halaman yang seharusnya (children)
  return children;
}