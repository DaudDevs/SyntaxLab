import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
// 1. Impor fungsi-fungsi yang dibutuhkan dari Firestore
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export default function CoursesPage() {
  // 2. Siapkan state untuk menyimpan daftar kursus dan status loading
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Gunakan useEffect untuk mengambil data saat halaman pertama kali dimuat
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Buat query untuk mengambil semua dokumen dari koleksi 'courses', diurutkan berdasarkan tanggal dibuat
        const coursesQuery = query(collection(db, "courses"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(coursesQuery);
        
        // Ubah data hasil query menjadi array yang bisa digunakan oleh React
        const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
      } catch (error) {
        console.error("Gagal mengambil data kursus: ", error);
      } finally {
        setLoading(false); // Hentikan loading setelah selesai (baik berhasil maupun gagal)
      }
    };

    fetchCourses();
  }, []); // Array dependensi kosong berarti efek ini hanya berjalan sekali

  return (
    <div className="py-16">
      <h1 className="text-5xl font-bold text-white text-center mb-4">Semua Kursus</h1>
      <p className="text-xl text-gray-400 text-center mb-12">Temukan passion Anda dan mulailah perjalanan coding Anda hari ini.</p>
      
      {/* Tampilkan pesan loading saat data sedang diambil */}
      {loading ? (
        <p className="text-center text-gray-400 text-xl">Memuat kursus...</p>
      ) : (
        // Jika loading selesai, tampilkan grid kursus
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              thumbnail={course.thumbnail}
              title={course.title}
              instructor={course.instructor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

