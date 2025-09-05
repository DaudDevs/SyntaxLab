import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// 1. Impor fungsi-fungsi yang kita butuhkan dari Firestore
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
// 2. Kita akan gunakan ulang komponen CourseCard
import CourseCard from '../components/CourseCard'; 

export default function DashboardPage() {
  const { currentUser } = useAuth();
  // 3. Siapkan state untuk menyimpan daftar kursus dan status loading
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. Gunakan useEffect untuk mengambil data kursus dari Firestore saat halaman dimuat
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      // Pastikan ada pengguna yang login sebelum mengambil data
      if (currentUser) {
        try {
          // Buat referensi ke KOLEKSI 'courses' di dalam dokumen pengguna
          // Path: /users/{userId}/courses
          const coursesCollectionRef = collection(db, 'users', currentUser.uid, 'courses');
          
          // Ambil semua dokumen dari koleksi tersebut
          const querySnapshot = await getDocs(coursesCollectionRef);
          
          // Ubah hasil query (querySnapshot) menjadi array yang bisa kita gunakan
          const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setEnrolledCourses(courses);
        } catch (error) {
          console.error("Gagal mengambil data kursus:", error);
        } finally {
          setLoading(false); // Hentikan loading setelah selesai (baik berhasil maupun gagal)
        }
      }
    };
    
    fetchEnrolledCourses();
  }, [currentUser]); // Efek ini akan berjalan lagi jika currentUser berubah (misal: saat login/logout)

  return (
    <div className="py-12">
      <h1 className="text-5xl font-bold text-white text-center mb-4">Dashboard</h1>
      <p className="text-xl text-gray-400 text-center mb-12">
        Selamat datang, <span className="text-green-400">{currentUser?.email.split('@')[0]}</span>!
      </p>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Kursus Anda</h2>
        
        {/* Tampilkan pesan loading saat data sedang diambil */}
        {loading && <p className="text-center text-gray-400">Memuat kursus Anda...</p>}

        {/* Jika loading selesai dan tidak ada kursus, tampilkan pesan ini */}
        {!loading && enrolledCourses.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            <p>Anda belum mendaftar di kursus manapun.</p>
          </div>
        )}

        {/* Jika loading selesai dan ADA kursus, tampilkan grid kartu kursus */}
        {!loading && enrolledCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map(course => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                thumbnail={course.thumbnail}
                // Kita manfaatkan prop 'instructor' untuk menampilkan progress
                instructor={`Progress: ${course.progress}%`} 
                // Berikan prop linkTo agar kartu mengarah ke halaman belajar
                linkTo={`/learn/${course.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

