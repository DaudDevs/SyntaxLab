import React, { forwardRef } from 'react';

// Kita menggunakan forwardRef agar komponen induk (LearningPage) bisa mendapatkan
// referensi ke elemen DOM <div> sertifikat ini untuk diubah menjadi gambar.
const Certificate = forwardRef(({ studentName, courseName }, ref) => {
  // Style untuk background dengan pola grid yang samar, mirip tema web
  const backgroundStyle = {
    backgroundImage: 'radial-gradient(circle, rgba(52, 211, 153, 0.05) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  };

  return (
    // 'ref' dari parameter di-pass ke elemen div ini
    <div 
      ref={ref} 
      style={backgroundStyle}
      // Dibuat responsif: lebar penuh di mobile, maksimal di desktop, dengan aspek rasio tetap
      className="w-full max-w-4xl mx-auto aspect-[800/565] bg-gray-900 text-white p-6 sm:p-10 flex flex-col justify-between font-sans border-2 border-green-500/30 shadow-2xl shadow-green-500/20"
    >
      {/* Header Sertifikat */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold">SyntaxLab</h1>
            <p className="text-sm sm:text-base text-green-400">Platform Belajar Koding</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs sm:text-base text-gray-400">Sertifikat Kelulusan</p>
          <p className="text-xs text-gray-500 mt-1">ID: CERT-{Date.now()}</p>
        </div>
      </div>
      
      {/* Konten Utama */}
      <div className="text-center my-4 sm:my-0">
        <p className="text-base sm:text-xl text-gray-300 mb-2 sm:mb-4">Dengan ini diberikan kepada:</p>
        <h2 className="text-4xl sm:text-6xl font-extrabold text-green-400 tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
          {studentName}
        </h2>
        <p className="text-base sm:text-xl text-gray-300 mt-4 sm:mt-8 mb-2 sm:mb-4">
          atas keberhasilannya menyelesaikan kursus online:
        </p>
        <h3 className="text-2xl sm:text-4xl font-bold text-white">
          {courseName}
        </h3>
      </div>
      
      {/* Footer / Tanda Tangan */}
      <div className="flex justify-between items-end border-t border-green-500/20 pt-2 sm:pt-4">
        <div className="text-center">
          <p className="font-bold text-sm sm:text-lg">Budi Santoso</p>
          <p className="text-xs sm:text-sm text-gray-400">CEO, SyntaxLab</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-sm sm:text-lg">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-xs sm:text-sm text-gray-400">Tanggal Penyelesaian</p>
        </div>
      </div>
    </div>
  );
});

export default Certificate;

