import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Certificate from '../components/Certificate';
import { toPng } from 'html-to-image';
// Impor ReactMarkdown
import ReactMarkdown from 'react-markdown';

export default function LearningPage() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef();

  // ... (useEffect dan fungsi-fungsi lainnya tetap sama)
  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);
        if (!courseSnap.exists()) { navigate('/dashboard'); return; }
        const courseData = { id: courseSnap.id, ...courseSnap.data() };
        setCourse(courseData);

        const progressRef = doc(db, 'users', currentUser.uid, 'courses', courseId);
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists()) {
          const progressData = progressSnap.data();
          setUserProgress(progressData);
          if (courseData.lessons && courseData.lessons.length > 0) {
            setActiveLesson(courseData.lessons[0]);
          }
        } else {
          navigate('/dashboard');
        }
      } catch (error) { console.error("Gagal mengambil data:", error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [currentUser, courseId, navigate]);

  const markLessonAsComplete = async (lessonId) => {
    if (!course || !userProgress) return;
    const completed = userProgress.completedLessons || [];
    if (completed.includes(lessonId)) return;

    const newCompletedLessons = [...completed, lessonId];
    const totalLessons = Array.isArray(course.lessons) ? course.lessons.length : 1;
    const newProgress = Math.round((newCompletedLessons.length / totalLessons) * 100);
    const docRef = doc(db, 'users', currentUser.uid, 'courses', courseId);
    
    await updateDoc(docRef, { completedLessons: newCompletedLessons, progress: newProgress });
    setUserProgress(prev => ({ ...prev, completedLessons: newCompletedLessons, progress: newProgress }));
  };

  const handleNext = async () => {
    if (!activeLesson) return;
    await markLessonAsComplete(activeLesson.id);

    const currentIndex = lessons.findIndex(lesson => lesson.id === activeLesson.id);
    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson) {
      setActiveLesson(nextLesson);
    }
  };
  
  const handleDownloadCertificate = () => {
    if (certificateRef.current === null) return;
    toPng(certificateRef.current, { cacheBust: true, quality: 0.95, backgroundColor: '#111827' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `sertifikat-${course.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Gagal membuat gambar sertifikat!', err));
  };


  if (loading || !course || !userProgress) {
    return <div className="text-center py-20 text-white text-xl">Memuat Halaman Belajar...</div>;
  }
  
  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
  const progressPercentage = userProgress.progress || 0;
  
  const activeLessonIndex = lessons.findIndex(lesson => lesson.id === activeLesson?.id);
  const isLastLesson = activeLessonIndex === lessons.length - 1;
  const isCurrentLessonCompleted = userProgress.completedLessons?.includes(activeLesson?.id);

  return (
    <>
      <div className="py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 flex flex-col">
            <Link to="/dashboard" className="mb-8 text-green-400 hover:underline inline-flex items-center self-start">
              &larr; Kembali ke Dashboard
            </Link>
            <div className="flex-grow">
              {activeLesson ? (
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{activeLesson.title}</h1>
                  <p className="text-gray-400 mb-8">Pelajaran dari kursus: {course.title}</p>
                  
                  <div className="text-gray-300">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4 text-white" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold my-4 text-white" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 text-lg leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 pl-4 space-y-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 pl-4 space-y-2" {...props} />,
                        li: ({node, ...props}) => <li className="text-lg" {...props} />,
                        // Perbaikan di sini: tambahkan 'whitespace-pre-wrap' dan 'break-words'
                        pre: ({node, ...props}) => <pre className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm overflow-x-auto my-4 whitespace-pre-wrap break-words" {...props} />,
                        code({node, inline, className, children, ...props}) {
                           return inline ? (
                            <code className="bg-gray-700 text-green-300 px-1.5 py-1 rounded-md text-sm font-mono" {...props}>{children}</code>
                          ) : (
                            <code className={className} {...props}>{children}</code>
                          )
                        }
                      }}
                    >
                      {activeLesson.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400">{lessons.length > 0 ? "Pilih pelajaran dari daftar di samping untuk memulai." : "Instruktur belum menambahkan pelajaran untuk kursus ini."}</p>
                </div>
              )}
            </div>

            {/* Tombol Next/Selesai */}
            {activeLesson && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                {!isLastLesson ? (
                  <button onClick={handleNext} className="w-full bg-green-500 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105">
                    {isCurrentLessonCompleted ? 'Pelajaran Berikutnya' : 'Selesaikan & Lanjut'} &rarr;
                  </button>
                ) : (
                  !isCurrentLessonCompleted ? (
                    <button onClick={() => markLessonAsComplete(activeLesson.id)} className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg hover:bg-yellow-400 transition-all">
                        Selesaikan Kursus 🎉
                    </button>
                  ) : (
                    <div className="text-center">
                       <p className="text-lg text-green-400 font-bold mb-4">Selamat, Anda telah menyelesaikan kursus ini!</p>
                       <button onClick={() => setShowCertificate(true)} className="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors">Lihat Sertifikat</button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 self-start sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-4">Daftar Pelajaran</h2>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-400 mb-6 text-right">{progressPercentage}% Selesai</p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {lessons.map((lesson, index) => {
                const isCompleted = userProgress.completedLessons?.includes(lesson.id);
                return (
                  <div key={lesson.id} onClick={() => setActiveLesson(lesson)} className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${activeLesson?.id === lesson.id ? 'bg-green-900/50 border-green-500' : 'bg-gray-900/50 border-transparent hover:border-gray-600'}`}>
                    <div className="flex items-start">
                      <span className={`mr-4 mt-1 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${isCompleted ? 'bg-green-500 text-gray-900' : 'bg-gray-700 text-white'}`}>{index + 1}</span>
                      <div><h3 className="font-semibold text-white">{lesson.title}</h3></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Sertifikat */}
      {showCertificate && (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <Certificate ref={certificateRef} studentName={currentUser.email.split('@')[0]} courseName={course.title} />
            <button onClick={() => setShowCertificate(false)} className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold hover:bg-red-500 transition-colors">&times;</button>
            <button onClick={handleDownloadCertificate} className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-green-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-400">
              Unduh Sertifikat
            </button>
          </div>
        </div>
      )}
    </>
  );
}

