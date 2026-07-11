import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Register
const btn = document.querySelector("button");

if (btn && document.getElementById("confirmPassword")) {

  btn.addEventListener("click", async () => {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        balance: 0,
        joinDate: new Date().toLocaleDateString()
      });

      alert("Account created successfully!");
      window.location.href = "login.html";

    } catch (error) {
      alert(error.message);
    }

  });

}

// Login
if (btn && !document.getElementById("confirmPassword")) {

  btn.addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";

    } catch (error) {
      alert(error.message);
    }

  });

}

// Dashboard
onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  const emailBox = document.getElementById("userEmail");
  const balanceBox = document.getElementById("balance");

  if (emailBox) {
    emailBox.innerHTML = "Email: " + user.email;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists() && balanceBox) {
    balanceBox.innerHTML = docSnap.data().balance;
  }

});

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);
    window.location.href = "login.html";

  });

}