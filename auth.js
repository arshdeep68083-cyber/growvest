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

// ================= REGISTER =================

const registerBtn = document.querySelector("button");

if (registerBtn && document.getElementById("confirmPassword")) {

  registerBtn.addEventListener("click", async () => {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        balance: 0,
        joinDate: new Date().toLocaleDateString()
      });

      alert("Account Created Successfully");
      window.location.href = "login.html";

    } catch (error) {
      alert(error.message);
    }

  });

}

// ================= LOGIN =================

if (registerBtn && !document.getElementById("confirmPassword")) {

  registerBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Enter Email & Password");
      return;
    }

    try {

      await signInWithEmailAndPassword(auth, email, password);

      window.location.href = "dashboard.html";

    } catch (error) {
      alert(error.message);
    }

  });

}

// ================= DASHBOARD =================

onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  const emailBox = document.getElementById("userEmail");
  const balanceBox = document.getElementById("balance");

  if (emailBox) {
    emailBox.innerHTML = user.email;
  }

  if (balanceBox) {

    try {

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {

        const data = userSnap.data();

        balanceBox.innerHTML = data.balance || 0;

      } else {

        balanceBox.innerHTML = 0;

      }

    } catch (error) {

      balanceBox.innerHTML = 0;

    }

  }

});

// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

  });

}