import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. Impor fungsi untuk membuat user dan auth dari file firebase.js kita
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

export default function RegisterPage() {
  // 2. Siapkan state untuk menyimpan inputan form, error, dan status loading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 3. Inisialisasi hook useNavigate untuk redirect
  const navigate = useNavigate();

  // 4. Buat fungsi yang akan dijalankan saat form disubmit
  const handleRegister = async (e) => {
    e.preventDefault(); // Mencegah form me-refresh halaman
    setError(''); // Bersihkan error sebelumnya
    setLoading(true); // Mulai proses loading

    // Periksa jika password terlalu pendek
    if (password.length < 6) {
      setError("Password harus memiliki minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      // 5. Panggil fungsi dari Firebase untuk membuat user baru
      await createUserWithEmailAndPassword(auth, email, password);
      // 6. Jika berhasil, arahkan (redirect) pengguna ke halaman utama
      navigate('/'); 
    } catch (err) {
      // 7. Jika gagal, tampilkan pesan error yang lebih mudah dimengerti
      console.error("Firebase registration error:", err.code);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah terdaftar. Silakan login.');
      } else {
        setError('Gagal membuat akun. Silakan coba lagi.');
      }
    } finally {
      // 8. Hentikan proses loading, baik berhasil maupun gagal
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-white mb-8">Buat Akun</h2>
        
        {/* Hubungkan form dengan fungsi handleRegister */}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email} // Hubungkan dengan state email
              onChange={(e) => setEmail(e.target.value)} // Update state saat diketik
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
              value={password} // Hubungkan dengan state password
              onChange={(e) => setPassword(e.target.value)} // Update state saat diketik
              className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Minimal 6 karakter"
              required
            />
          </div>

          {/* Tampilkan pesan error jika ada */}
          {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-md">{error}</p>}

          <button
            type="submit"
            disabled={loading} // Nonaktifkan tombol saat loading
            className="w-full bg-green-500 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100"
          >
            {/* Ganti teks tombol saat loading */}
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

