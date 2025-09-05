import React, { useState } from 'react';

export default function DonationPage() {
  // Ganti 'usernamekamu' dengan username Saweria Anda yang sebenarnya
  const saweriaUrl = 'https://saweria.co/Hansszs';

  const [amount, setAmount] = useState(50000);
  const donationOptions = [25000, 50000, 100000, 250000];

  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-lg w-full text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Dukung SyntaxLab</h2>
        <p className="text-gray-300 mb-8">
          Dukungan Anda sangat berarti bagi kami untuk terus membuat konten berkualitas. Anda akan diarahkan ke halaman Saweria untuk menyelesaikan donasi.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {donationOptions.map(option => (
            <button
              key={option}
              onClick={() => setAmount(option)}
              className={`py-4 px-2 rounded-lg font-bold text-lg transition-all border-2 ${amount === option ? 'bg-green-500 text-gray-900 border-green-500' : 'bg-gray-700 text-white border-gray-600 hover:border-green-500'}`}
            >
              Rp{option.toLocaleString('id-ID')}
            </button>
          ))}
        </div>

        {/* Tombol ini sekarang adalah sebuah link (tag <a>) ke Saweria */}
        <a
          href={saweriaUrl}
          target="_blank" // Membuka di tab baru
          rel="noopener noreferrer" // Praktik keamanan untuk link eksternal
          className="inline-block w-full bg-green-500 text-gray-900 font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105"
        >
          Lanjutkan ke Saweria
        </a>
      </div>
    </div>
  );
}

