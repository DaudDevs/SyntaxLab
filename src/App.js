import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Komponen
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import InstructorRoute from './components/InstructorRoute';

// Halaman
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LearningPage from './pages/LearningPage';
import DonationPage from './pages/DonationPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import AddCoursePage from './pages/AddCoursePage';
import ManageCoursePage from './pages/ManageCoursePage';
import EditCoursePage from './pages/EditCoursePage';
// 1. Impor halaman verifikasi yang baru
import VerifyEmailPage from './pages/VerifyEmailPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen font-sans bg-grid-gray-700/[0.2]">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-95"></div>
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            
            <main className="container mx-auto px-6 flex-grow">
              <Routes>
                {/* Rute Publik */}
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:courseId" element={<CourseDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* 2. Tambahkan rute untuk halaman verifikasi. 
                    Rute ini tidak perlu ProtectedRoute yang ketat karena 
                    pengguna yang belum terverifikasi harus bisa mengaksesnya. */}
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* Rute Terproteksi untuk Murid */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/learn/:courseId" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
                <Route path="/donation" element={<ProtectedRoute><DonationPage /></ProtectedRoute>} />
                
                {/* Rute Terproteksi untuk Instruktur */}
                <Route path="/instructor/dashboard" element={<InstructorRoute><InstructorDashboardPage /></InstructorRoute>} />
                <Route path="/instructor/add-course" element={<InstructorRoute><AddCoursePage /></InstructorRoute>} />
                <Route path="/instructor/manage-course/:courseId" element={<InstructorRoute><ManageCoursePage /></InstructorRoute>} />
                <Route path="/instructor/edit-course/:courseId" element={<InstructorRoute><EditCoursePage /></InstructorRoute>} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

