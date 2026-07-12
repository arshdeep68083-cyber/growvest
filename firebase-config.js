// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCmPFHqp9LtrHFklqo_nD2wl7L_IWlY0SA",
  authDomain: "growvest-4eb24.firebaseapp.com",
  projectId: "growvest-4eb24",
  storageBucket: "growvest-4eb24.firebasestorage.app",
  messagingSenderId: "516443488034",
  appId: "1:516443488034:web:5cab0f21e4f840ebab2f7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export
export { auth, db, storage };
