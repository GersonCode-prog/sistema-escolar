// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBs0NHn61Hu8l2aNkvdlQkmsneKa4rKdZM",
    authDomain: "sistema-estudiantes-9ef4e.firebaseapp.com",
    projectId: "sistema-estudiantes-9ef4e",
    storageBucket: "sistema-estudiantes-9ef4e.appspot.com",
    messagingSenderId: "137791433583",
    appId: "1:137791433583:web:dc72f6d5751c5ecede169a"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
