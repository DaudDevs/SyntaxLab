import React from 'react';
import CourseCard from './CourseCard'; // Kita akan pakai ulang CourseCard

// Kita letakkan data contoh di sini agar lebih rapi
const featuredCourses = [
  {
    id: 1,
    title: 'Dasar-dasar HTML & CSS',
    instructor: 'Budi Santoso',
    thumbnail: 'https://placehold.co/600x400/052e16/34d399?text=HTML+%26+CSS',
  },
  {
    id: 2,
    title: 'JavaScript untuk Pemula',
    instructor: 'Citra Lestari',
    thumbnail: 'https://placehold.co/600x400/164e63/67e8f9?text=JavaScript',
  },
  {
    id: 3,
    title: 'React JS dari Awal',
    instructor: 'Agung Wijaya',
    thumbnail: 'https://placehold.co/600x400/1e1b4b/a5b4fc?text=React+JS',
  },
];


export default function FeaturedCourses() {
  return (
    <div className="py-16">
      <h2 className="text-4xl font-bold text-white text-center mb-2">Kursus Populer</h2>
      <p className="text-lg text-gray-400 text-center mb-12">Pilih jalur belajar yang paling sesuai dengan tujuan karirmu.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredCourses.map(course => (
          <CourseCard
            key={course.id}
            thumbnail={course.thumbnail}
            title={course.title}
            instructor={course.instructor}
            onClick={() => alert(`Anda mengklik kursus: ${course.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
