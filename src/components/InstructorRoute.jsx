import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function InstructorRoute({ children }) {
  const { currentUser } = useAuth();

  // Jika tidak ada user, tendang ke login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Jika user ADA tapi perannya BUKAN instruktur, tendang ke dasbor murid
  if (currentUser.role !== 'instructor') {
    return <Navigate to="/dashboard" />;
  }

  // Jika user adalah instruktur, izinkan akses
  return children;
}
