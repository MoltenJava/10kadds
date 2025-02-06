// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRiKBTzlGYzLmIkE1_0pi_BMPsDwWY5-4",
  authDomain: "k-adds.firebaseapp.com",
  projectId: "k-adds",
  storageBucket: "k-adds.firebasestorage.app",
  messagingSenderId: "153904024538",
  appId: "1:153904024538:web:4742ea1a1adbb8265ecee3",
  measurementId: "G-3RT82DHFM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore utilities along with db
export { db, collection, addDoc };
