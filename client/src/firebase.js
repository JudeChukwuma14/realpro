
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "realester-82162.firebaseapp.com",
  projectId: "realester-82162",
  storageBucket: "realester-82162.firebasestorage.app",
  messagingSenderId: "941739531131",
  appId: "1:941739531131:web:e7b17c6ea8862ec85fbbde",
  measurementId: "G-XPKNLWKZ9Y"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
