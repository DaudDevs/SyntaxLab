import React from 'react';
import { Link } from 'react-router-dom';
// 1. Impor custom hook useAuth untuk mendapatkan status login
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  // 2. Dapatkan data pengguna yang sedang login dari context
  const { currentUser } = useAuth(); 

  return (
    <footer className="text-center p-6 mt-8 border-t border-gray-800">
      <div className="flex justify-center space-x-6 mb-4">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
        <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Kursus</Link>
        
        {/* 3. Gunakan conditional rendering: Tampilkan link Donasi hanya jika currentUser ada (tidak null) */}
        {currentUser && (
          <Link to="/donation" className="text-gray-400 hover:text-white transition-colors">Donasi</Link>
        )}
      </div>
      <p className="text-gray-500">&copy; {new Date().getFullYear()} SyntaxLab. All rights reserved.</p>
    </footer>
  );
}