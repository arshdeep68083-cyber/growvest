// =====================================
// GrowVest Dashboard
// dashboard.js - Part 1
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= Firebase Config =================

const firebaseConfig = {
  apiKey: "AIzaSyCmPFHqp9LtrHFklqo_nD2wl7L_IWlY0SA",
  authDomain: "growvest-4eb24.firebaseapp.com",
  projectId: "growvest-4eb24",
  storageBucket: "growvest-4eb24.firebasestorage.app",
  messagingSenderId: "516443488034",
  appId: "1:516443488034:web:5cab0f21e4f840ebab2f7b"
};

// ================= Initialize Firebase =================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= HTML Elements =================

const balanceEl = document.getElementById("balance");
const emailEl = document.getElementById("userEmail");
const todayProfitEl = document.getElementById("todayProfit");
const logoutBtn = document.getElementById("logoutBtn");
const activePlanEl = document.getElementById("activePlan");

// ================= Load Logged-in User =================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailEl.textContent = user.email;

  try {

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {

      const data = snap.data();

      balanceEl.textContent =
        Number(data.balance || 0).toFixed(2) + " USDT";

      if (todayProfitEl) {
        todayProfitEl.textContent =
          "+" + Number(data.todayProfit || 0).toFixed(2) + " USDT";
      }

    }

  } catch (err) {

    console.log(err);

  }

});
