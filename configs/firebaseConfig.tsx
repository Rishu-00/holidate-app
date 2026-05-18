import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1R2hZq0uFJISrvkDeK5v3eLNYJWOBwEw",
  authDomain: "holidate-app-2ef1c.firebaseapp.com",
  projectId: "holidate-app-2ef1c",
  storageBucket: "holidate-app-2ef1c.firebasestorage.app",
  messagingSenderId: "772468717583",
  appId: "1:772468717583:web:128966345f6f3638a20b7a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);