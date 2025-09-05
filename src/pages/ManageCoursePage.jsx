import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function ManageCoursePage() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State disederhanakan, hanya untuk judul dan konten
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    const courseRef = doc(db, 'courses', courseId);
    getDoc(courseRef).then(docSnap => {
      if (docSnap.exists() && docSnap.data().instructorId === currentUser.uid) {
        setCourse({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate('/instructor/dashboard');
      }
      setLoading(false);
    });
  }, [courseId, currentUser, navigate]);

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newLessonContent.trim()) {
      setError('Judul dan Konten pelajaran tidak boleh kosong.');
      return;
    }
    setError('');

    // Struktur pelajaran sekarang lebih sederhana
    const newLesson = {
      id: Date.now(),
      title: newLessonTitle.trim(),
      content: newLessonContent.trim(),
      type: 'text', // Selalu bertipe teks
    };

    const courseRef = doc(db, 'courses', courseId);
    try {
      await updateDoc(courseRef, {
        lessons: arrayUnion(newLesson)
      });
      setCourse(prevCourse => ({
        ...prevCourse,
        lessons: [...(prevCourse.lessons || []), newLesson]
      }));
      // Reset form
      setNewLessonTitle('');
      setNewLessonContent('');
    } catch (err) {
      console.error("Error adding lesson:", err);
      setError('Gagal menambahkan pelajaran.');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white">Memuat data kursus...</div>;
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/instructor/dashboard" className="mb-8 bg-gray-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-600 inline-flex items-center">
          &larr; Kembali ke Dasbor
        </Link>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kelola Kursus</h1>
          <p className="text-2xl text-green-400 mb-8">{course.title}</p>
          
          <h2 className="text-2xl font-bold text-white mb-4">Daftar Pelajaran</h2>
          <div className="space-y-2 mb-8">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons.map(lesson => (
                <div key={lesson.id} className="bg-gray-900/50 p-3 rounded-md text-gray-300">
                  {lesson.title}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Belum ada pelajaran.</p>
            )}
          </div>

          <form onSubmit={handleAddLesson} className="border-t border-gray-700 pt-6 space-y-4">
            <h2 className="text-2xl font-bold text-white">Tambah Pelajaran Baru</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            
            <div>
              <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-300">Judul Pelajaran</label>
              <input
                id="lessonTitle"
                type="text"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                className="mt-1 w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white"
              />
            </div>

            <div>
              <label htmlFor="lessonContent" className="block text-sm font-medium text-gray-300">
                Isi Materi (Teks)
              </label>
              <textarea
                id="lessonContent"
                value={newLessonContent}
                onChange={(e) => setNewLessonContent(e.target.value)}
                rows="5"
                placeholder="Tulis materi pelajaran di sini..."
                className="mt-1 w-full bg-gray-900/50 border border-gray-600 rounded-md py-3 px-4 text-white"
              />
            </div>
            
            <button type="submit" className="w-full bg-green-500 text-gray-900 font-bold py-3 px-6 rounded-md hover:bg-green-400 transition-colors">
              Simpan Pelajaran
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

