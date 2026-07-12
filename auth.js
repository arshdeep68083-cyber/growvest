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

// ================= BUTTONS =================

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

// ================= REGISTER =================

if (registerBtn) {

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

      const userCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
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

if (loginBtn) {

  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Please enter Email & Password");
      return;
    }

    try {

      loginBtn.disabled = true;
      loginBtn.innerHTML = "Signing In...";

      await signInWithEmailAndPassword(auth, email, password);

      window.location.href = "dashboard.html";

    } catch (error) {

      alert(error.message);

      loginBtn.disabled = false;
      loginBtn.innerHTML = "Login Securely";

    }

  });

}

// ================= DASHBOARD =================

onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  const emailBox = document.getElementById("userEmail");
  const balanceBox = document.getElementById("balance");

  if (emailBox) {
    emailBox.textContent = user.email;
  }

  if (balanceBox) {

    try {

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {

        const data = userSnap.data();

        balanceBox.textContent =
          (Number(data.balance) || 0).toFixed(2) + " USDT";

      } else {

        balanceBox.textContent = "0.00 USDT";

      }

    } catch (error) {

      balanceBox.textContent = "0.00 USDT";

    }

  }

});
// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      await signOut(auth);

      window.location.href = "login.html";

    } catch (error) {

      alert(error.message);

    }

  });

}

// ================= APP READY =================

window.addEventListener("DOMContentLoaded", () => {

  console.log("GrowVest Loaded Successfully");

});
