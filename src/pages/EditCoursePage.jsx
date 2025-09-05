import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function EditCoursePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const courseRef = doc(db, 'courses', courseId);
    getDoc(courseRef).then(docSnap => {
      if (docSnap.exists() && docSnap.data().instructorId === currentUser.uid) {
        const courseData = docSnap.data();
        setTitle(courseData.title);
        setDescription(courseData.description);
        setThumbnail(courseData.thumbnail);
      } else {
        navigate('/instructor/dashboard');
      }
      setLoading(false);
    });
  }, [courseId, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const courseRef = doc(db, 'courses', courseId);
    try {
      await updateDoc(courseRef, { title, description, thumbnail });
      navigate('/instructor/dashboard');
    } catch (err) {
      console.error("Error updating document: ", err);
      setError('Gagal memperbarui kursus.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const courseRef = doc(db, 'courses', courseId);
    try {
      await deleteDoc(courseRef);
      navigate('/instructor/dashboard');
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError('Gagal menghapus kursus.');
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading && !showDeleteModal) {
    return <div className="text-center py-20 text-white">Memuat formulir...</div>;
  }

  const inputClass = "mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/instructor/dashboard" className="mb-8 bg-gray-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center">
            &larr; Kembali ke Dasbor
          </Link>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
            <h1 className="text-4xl font-bold text-white mb-8">Edit Kursus</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Judul Kursus</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Deskripsi</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className={inputClass} required></textarea>
              </div>
              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300">URL Thumbnail</label>
                <input type="text" id="thumbnail" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className={inputClass} />
              </div>
              {error && <p className="text-red-400 text-center bg-red-900/20 p-3 rounded-md">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-green-500 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100">
                {loading ? 'Memperbarui...' : 'Simpan Perubahan'}
              </button>
            </form>

            <div className="border-t border-red-500/30 mt-8 pt-6">
              <h2 className="text-xl font-bold text-red-400">Zona Berbahaya</h2>
              <p className="text-gray-400 mt-2">Tindakan ini tidak dapat diurungkan. Ini akan menghapus kursus secara permanen.</p>
              <button onClick={() => setShowDeleteModal(true)} className="mt-4 bg-red-600 text-white font-bold py-2 px-5 rounded-md hover:bg-red-500 transition-colors">
                Hapus Kursus Ini
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Anda Yakin?</h2>
            <p className="text-gray-300 mb-8">
              Apakah Anda benar-benar ingin menghapus kursus <strong className="text-white">{`"${title}"`}</strong>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg">
                Batal
              </button>
              <button onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg disabled:bg-gray-500">
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

