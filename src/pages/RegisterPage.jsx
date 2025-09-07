import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. Impor 'sendEmailVerification'
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../firebase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError("Password harus memiliki minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 2. Kirim email verifikasi ke pengguna yang baru dibuat
      await sendEmailVerification(userCredential.user);
      
      // 3. Arahkan pengguna ke halaman verifikasi, bukan halaman utama
      navigate('/verify-email'); 
    } catch (err) {
      console.error("Firebase registration error:", err.code);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah terdaftar. Silakan login.');
      } else {
        setError('Gagal membuat akun. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... JSX form tetap sama seperti sebelumnya ...
    <div className="flex items-center justify-center py-12">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-white mb-8">Buat Akun</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Minimal 6 karakter" required />
          </div>
          {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-md">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-green-500 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100">
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-green-400 hover:underline font-semibold">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

