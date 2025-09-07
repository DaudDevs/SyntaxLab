import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// 1. Impor 'auth' dari firebase untuk mendapatkan status pengguna terbaru
import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    if (!currentUser) {
      setError('Anda harus login untuk mengirim ulang email verifikasi.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await sendEmailVerification(currentUser);
      setMessage('Email verifikasi baru telah dikirim. Silakan periksa kotak masuk dan folder spam Anda.');
    } catch (err) {
      console.error("Error resending verification email:", err);
      setError('Gagal mengirim ulang email. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fungsi baru untuk memeriksa status verifikasi secara paksa
  const handleCheckVerification = async () => {
    if (!currentUser) return;
    
    // 3. Ambil ulang data pengguna terbaru dari server Firebase
    await currentUser.reload();

    // 4. Setelah di-reload, periksa status 'emailVerified' dari 'auth.currentUser'
    //    'auth.currentUser' adalah sumber paling update setelah reload.
    if (auth.currentUser.emailVerified) {
      navigate('/dashboard'); // Jika sudah terverifikasi, arahkan ke dasbor
    } else {
      setError("Email Anda masih belum terverifikasi. Silakan klik link di email Anda terlebih dahulu.");
    }
  };

  const handleLogoutAndLogin = async () => {
    try {
        await logout();
        navigate('/login');
    } catch {
        setError('Gagal untuk logout.');
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-lg w-full text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Verifikasi Email Anda</h2>
        <p className="text-gray-300 mb-8">
          Sebuah link verifikasi telah dikirim ke email Anda: <strong className="text-green-400">{currentUser?.email}</strong>. Silakan klik link tersebut untuk mengaktifkan akun Anda.
        </p>
        
        {message && <p className="text-green-400 text-center bg-green-900/20 p-3 rounded-md mb-4">{message}</p>}
        {error && <p className="text-red-400 text-center bg-red-900/20 p-3 rounded-md mb-4">{error}</p>}
        
        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-blue-500 transition-all duration-300 disabled:bg-gray-500"
          >
            {loading ? 'Mengirim...' : 'Kirim Ulang Email'}
          </button>
          {/* 5. Ganti tombol refresh lama dengan tombol yang lebih pintar ini */}
          <button
            onClick={handleCheckVerification}
            className="w-full bg-green-500 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-400 transition-all duration-300"
          >
            Saya Sudah Verifikasi
          </button>
        </div>
         <p className="mt-6 text-center text-gray-400 text-sm">
            Salah akun?{' '}
            <button onClick={handleLogoutAndLogin} className="text-green-400 hover:underline font-semibold">
                Logout
            </button>
        </p>
      </div>
    </div>
  );
}

