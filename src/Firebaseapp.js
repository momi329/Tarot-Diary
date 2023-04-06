// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjoZe3affRBuw-DUZ5WwCtBXVxc4oi0BI",
  authDomain: "tarot-diary.firebaseapp.com",
  projectId: "tarot-diary",
  storageBucket: "tarot-diary.appspot.com",
  messagingSenderId: "339110698426",
  appId: "1:339110698426:web:f115d61ea8668a6a565183",
  measurementId: "G-L8RC14KPQY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
