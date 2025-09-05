import React from 'react';

export default function HeroSection({ onStartLearning }) {
  return (
    <div className="text-center py-20 md:py-32 relative overflow-hidden">
      {/* Efek globe di background */}
      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10">
        <div className="w-[600px] h-[600px] rounded-full border-t-2 border-r-2 border-green-500 animate-spin-slow"></div>
        <div className="w-[450px] h-[450px] rounded-full border-b-2 border-l-2 border-green-700 absolute animate-spin-slow-reverse"></div>
      </div>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          Kuasai Skill Coding Impianmu
          <br />
          <span className="text-green-400">Secara Terstruktur</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          SyntaxLab menyediakan jalur belajar yang jelas dan proyek dunia nyata untuk membantumu beralih karier menjadi developer profesional.
        </p>
        <button 
          onClick={onStartLearning}
          className="bg-green-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(52,211,153,0.5)]">
          Mulai Belajar Sekarang
        </button>
      </div>
    </div>
  );
}
