import React, { useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// 1. Impor 'db' (database) dari konfigurasi firebase Anda
import { auth, db } from '../firebase'; 
// 2. Impor fungsi untuk mengambil dokumen dari Firestore
import { doc, getDoc } from 'firebase/firestore'; 

// Membuat Context
const AuthContext = React.createContext();

// Membuat custom hook untuk kemudahan penggunaan
export function useAuth() {
  return useContext(AuthContext);
}

// Komponen Provider utama
export function AuthProvider({ children }) {
  // State currentUser sekarang akan menyimpan gabungan data dari Auth dan Firestore
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function logout() {
    return signOut(auth);
  }

  // Efek ini berjalan saat aplikasi dimuat dan setiap kali status login berubah
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Jika PENGGUNA TERDETEKSI (baru login atau sesi masih aktif)
        try {
          // 3. Buat referensi ke dokumen pengguna di Firestore
          //    Path: /users/{uid_pengguna}
          const userDocRef = doc(db, 'users', user.uid);
          // 4. Ambil data dokumen tersebut
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            // 5. Jika dokumen ditemukan, gabungkan data auth (user) dengan data firestore (userDocSnap.data())
            //    Ini akan menambahkan field 'role' ke objek currentUser kita
            setCurrentUser({ ...user, ...userDocSnap.data() });
          } else {
            // Jika dokumen profil belum ada, gunakan data auth saja
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Gagal mengambil data pengguna dari Firestore", error);
          setCurrentUser(user); // Fallback ke data auth jika ada error
        }
      } else {
        // Jika TIDAK ADA PENGGUNA (logout)
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Membersihkan listener saat komponen tidak lagi digunakan
    return unsubscribe;
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  const value = {
    currentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

