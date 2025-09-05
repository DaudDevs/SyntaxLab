import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// 1. Impor fungsi-fungsi yang dibutuhkan dari Firestore
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function AddCoursePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State untuk menyimpan inputan dari form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      return setError('Judul dan deskripsi tidak boleh kosong.');
    }
    setLoading(true);
    setError('');

    try {
      // 2. Tambahkan dokumen baru ke koleksi 'courses' di Firestore
      await addDoc(collection(db, 'courses'), {
        title,
        description,
        instructor: currentUser.email.split('@')[0], // Gunakan nama dari user yang login
        instructorId: currentUser.uid,
        thumbnail: thumbnail || `https://placehold.co/600x400/052e16/34d399?text=${title.replace(/\s+/g, '+')}`, // Placeholder jika URL thumbnail kosong
        createdAt: serverTimestamp(), // Simpan waktu pembuatan
        lessons: [], // 3. PENTING: Inisialisasi properti 'lessons' sebagai array kosong
      });
      navigate('/instructor/dashboard'); // Arahkan kembali ke dasbor setelah berhasil
    } catch (err) {
      console.error("Error adding document: ", err);
      setError('Gagal menambahkan kursus. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/instructor/dashboard" className="mb-8 bg-gray-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center">
          &larr; Kembali ke Dasbor
        </Link>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
          <h1 className="text-4xl font-bold text-white mb-8">Tambah Kursus Baru</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">Judul Kursus</label>
              <input 
                type="text" 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" 
                required 
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Deskripsi</label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows="4" 
                className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" 
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300">URL Thumbnail (Opsional)</label>
              <input 
                type="text" 
                id="thumbnail" 
                value={thumbnail} 
                onChange={(e) => setThumbnail(e.target.value)} 
                className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
            {error && <p className="text-red-400 text-center bg-red-900/20 p-3 rounded-md">{error}</p>}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-green-500 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100"
            >
              {loading ? 'Menyimpan...' : 'Simpan Kursus'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

