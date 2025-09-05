import React from 'react';
import { Link } from 'react-router-dom';

// 1. Tambahkan 'linkTo' ke dalam daftar props yang diterima
export default function CourseCard({ id, thumbnail, title, instructor, linkTo }) {
  // 2. Tentukan URL tujuan.
  //    Gunakan 'linkTo' jika prop tersebut diberikan.
  //    Jika tidak, gunakan URL default ke halaman detail publik.
  const destination = linkTo || `/course/${id}`;

  return (
    // 3. Gunakan variabel 'destination' untuk properti 'to' pada Link
    <Link to={destination} className="block transform hover:-translate-y-2 transition-transform duration-300 group">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 h-full flex flex-col">
        {/* Gambar thumbnail kursus */}
        <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
        
        <div className="p-6 flex-grow flex flex-col">
          {/* Judul kursus */}
          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors flex-grow">
            {title}
          </h2>
          
          {/* Teks instruktur (atau progress di dashboard) */}
          <p className="text-gray-400 mt-2">{instructor}</p>
        </div>
      </div>
    </Link>
  );
}

