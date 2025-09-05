import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. Impor fungsi untuk login dari Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

export default function LoginPage() {
  // Siapkan state untuk inputan, error, dan status loading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Inisialisasi hook untuk redirect setelah login berhasil
  const navigate = useNavigate();

  // Fungsi yang dijalankan saat form login disubmit
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    setError('');
    setLoading(true);

    try {
      // 2. Panggil fungsi signInWithEmailAndPassword dari Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // 3. Jika berhasil, arahkan pengguna ke halaman utama ('/')
      navigate('/');
    } catch (err) {
      // 4. Tangani error spesifik untuk login agar pesan lebih ramah pengguna
      console.error("Firebase login error:", err.code);
       if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email atau password salah.');
      } else {
        setError('Gagal untuk login. Silakan coba lagi.');
      }
    } finally {
      // Hentikan loading, baik berhasil maupun gagal
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-white mb-8">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Tampilkan pesan error jika ada */}
          {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-md">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Belum punya akun?{' '}
          <Link to="/register" className="text-green-400 hover:underline font-semibold">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

