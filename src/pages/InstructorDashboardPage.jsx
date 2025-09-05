import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function InstructorDashboardPage() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, 'courses'), where("instructorId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCourses(coursesData);
        } catch (error) {
          console.error("Gagal mengambil kursus instruktur:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCourses();
  }, [currentUser]);

  return (
    <div className="py-12">
      <h1 className="text-5xl font-bold text-white text-center mb-12">Dasbor Instruktur</h1>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Manajemen Kursus</h2>
          <Link to="/instructor/add-course" className="bg-green-500 text-gray-900 font-bold py-2 px-5 rounded-md hover:bg-green-400 transition-colors">
            + Tambah Kursus Baru
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-400">Memuat kursus Anda...</p>
          ) : (
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="p-4">Judul Kursus</th>
                  <th className="p-4">Jumlah Pelajaran</th>
                  <th className="p-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map(course => (
                    <tr key={course.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="p-4 font-semibold text-white">{course.title}</td>
                      <td className="p-4">{Array.isArray(course.lessons) ? course.lessons.length : 0}</td>
                      {/* Kolom Aksi yang diperbarui dengan dua link */}
                      <td className="p-4 space-x-4">
                        <Link 
                          to={`/instructor/manage-course/${course.id}`} 
                          className="text-green-400 hover:underline font-semibold"
                        >
                          Kelola Pelajaran
                        </Link>
                        <Link 
                          to={`/instructor/edit-course/${course.id}`} 
                          className="text-yellow-400 hover:underline font-semibold"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-400">Anda belum membuat kursus.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

