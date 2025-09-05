import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          setCourse({ id: courseSnap.id, ...courseSnap.data() });

          if (currentUser) {
            const enrollmentRef = doc(db, 'users', currentUser.uid, 'courses', courseId);
            const enrollmentSnap = await getDoc(enrollmentRef);
            setIsEnrolled(enrollmentSnap.exists());
          }
        } else {
          console.error("Kursus tidak ditemukan!");
        }
      } catch (error) {
        console.error("Gagal mengambil data kursus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, currentUser]);

  const handleEnroll = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const courseDocRef = doc(db, 'users', currentUser.uid, 'courses', courseId);
    try {
      await setDoc(courseDocRef, {
        courseId: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        enrolledAt: new Date(),
        progress: 0,
      });
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error mendaftar kursus:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white text-xl">Memuat data kursus...</div>;
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-white">404 - Kursus Tidak Ditemukan</h1>
        <Link to="/courses" className="text-green-400 hover:underline mt-4 inline-block">Kembali ke Semua Kursus</Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <Link to="/courses" className="mb-8 bg-gray-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        Kembali ke Kursus
      </Link>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 p-8">
        <div className="md:flex md:space-x-8">
          <img src={course.thumbnail} alt={course.title} className="w-full md:w-1/3 h-auto object-cover rounded-lg mb-6 md:mb-0" />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-lg text-green-400 mb-4">oleh {course.instructor}</p>
            <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
            <button 
              onClick={handleEnroll}
              disabled={isEnrolled}
              className="mt-8 w-full md:w-auto bg-green-500 text-gray-900 font-bold py-3 px-12 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isEnrolled ? 'Sudah Terdaftar' : 'Ambil Kursus Ini'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

