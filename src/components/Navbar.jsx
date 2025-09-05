import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = "text-gray-300 hover:text-green-400 transition-colors duration-300";
  const activeLinkClass = "text-green-400";

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Gagal untuk logout", error);
    }
  };

  return (
    <header className="bg-black/30 backdrop-blur-lg p-4 sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          <h1 className="text-2xl font-bold text-white">SyntaxLab</h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Home</NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Kursus</NavLink>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <>
              {/* Sapaan ini sekarang menjadi link ke dashboard */}
              <Link to="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors">
                Halo, {currentUser.email.split('@')[0]}
              </Link>
              <button onClick={handleLogout} className="bg-red-600 text-white font-bold py-2 px-5 rounded-md hover:bg-red-500 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white font-semibold py-2 px-4">Login</Link>
              <Link to="/register" className="bg-green-500 text-gray-900 font-bold py-2 px-5 rounded-md hover:bg-green-400 transition-colors">Daftar</Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isOpen ? "M4 6h16M4 12h16m-7 6h7" : "M6 18L18 6M6 6l12 12"}></path></svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-4 items-center">
            <NavLink to="/" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/courses" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass} onClick={() => setIsOpen(false)}>Kursus</NavLink>
            <div className="border-t border-gray-700 w-full my-2"></div>
            
            {currentUser ? (
              <>
                {/* Sapaan mobile juga menjadi link ke dashboard */}
                <Link to="/dashboard" className="text-gray-300 py-2 w-full text-center hover:text-green-400" onClick={() => setIsOpen(false)}>
                  Halo, {currentUser.email.split('@')[0]}
                </Link>
                <button onClick={handleLogout} className="bg-red-600 text-white font-bold py-2 px-5 rounded-md w-full text-center">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-semibold py-2 w-full text-center" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="bg-green-500 text-gray-900 font-bold py-2 px-5 rounded-md w-full text-center" onClick={() => setIsOpen(false)}>Daftar</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

