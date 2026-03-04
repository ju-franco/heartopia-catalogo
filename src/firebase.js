import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Adicione isso

const firebaseConfig = {
  apiKey: "AIzaSyCclBZ6zbmPcXNcSFj4P2tJKJqsKuFEq4g",
  authDomain: "heartopia-203aa.firebaseapp.com",
  projectId: "heartopia-203aa",
  storageBucket: "heartopia-203aa.firebasestorage.app",
  messagingSenderId: "343324597786",
  appId: "1:343324597786:web:7202f3683f814a819dfba3",
  measurementId: "G-CS65GEQKY9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // Exporta a autenticação