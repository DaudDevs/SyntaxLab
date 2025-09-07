import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  // 1. Jika tidak ada pengguna yang login, arahkan ke halaman /login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // 2. Jika pengguna adalah seorang instruktur, izinkan akses tanpa memeriksa verifikasi email
  if (currentUser.role === 'instructor') {
    return children;
  }

  // 3. Jika bukan instruktur (murid), jalankan pemeriksaan verifikasi email
  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  // 4. Jika semua syarat terpenuhi (murid yang terverifikasi), izinkan akses
  return children;
}

