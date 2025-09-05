// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4ZKTnZfbfje1Q5f-cfLpMxdCSu-vVWm0",
  authDomain: "syntaxlab-app-react.firebaseapp.com",
  projectId: "syntaxlab-app-react",
  storageBucket: "syntaxlab-app-react.firebasestorage.app",
  messagingSenderId: "879967133844",
  appId: "1:879967133844:web:976a516baa6f3673cb9481",
  measurementId: "G-6Q97CSKXS3"
};

const app = initializeApp(firebaseConfig);

// Inisialisasi Firebase Authentication dan EKSPOR agar bisa digunakan di file lain
// Pastikan ada kata 'export' di sini. Inilah kunci perbaikannya.
export const auth = getAuth(app);
export const db = getFirestore(app);