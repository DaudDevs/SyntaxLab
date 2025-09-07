import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  // 1. Jika tidak ada pengguna yang login, arahkan ke halaman /login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // 2. Jika ada pengguna TAPI emailnya belum terverifikasi, arahkan ke halaman /verify-email
  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  // 3. Jika pengguna sudah login DAN emailnya sudah terverifikasi, izinkan akses
  return children;
}

