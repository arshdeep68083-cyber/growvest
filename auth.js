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

// ================= ELEMENTS =================

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

// ================= REGISTER =================

if (registerBtn) {

  registerBtn.addEventListener("click", async () => {

    const name =
      document.getElementById("name").value.trim();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const confirmPassword =
      document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {

      registerBtn.disabled = true;
      registerBtn.innerHTML = "Creating Account...";

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          name: name,
          email: email,
          balance: 0,
          joinDate: new Date().toLocaleDateString(),
          createdAt: Date.now()
        }
      );

      alert("Account Created Successfully");

      window.location.href = "login.html";

    } catch (error) {

      alert(error.message);

      registerBtn.disabled = false;
      registerBtn.innerHTML = "Create Account";

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
      loginBtn.innerHTML = "Secure Login";

    }

  });

}

// ================= DASHBOARD =================

onAuthStateChanged(auth, async (user) => {

  // Je login page te haan te user login nahi
  if (!user && window.location.pathname.includes("dashboard")) {
    window.location.href = "login.html";
    return;
  }

  // Dashboard te user login aa
  if (user) {

    try {

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {

        const data = userSnap.data();

        const userName = document.getElementById("userName");
        const balance = document.getElementById("balance");

        if (userName) {
          userName.textContent = data.name || user.email;
        }

        if (balance) {
          balance.textContent =
            "₹" + Number(data.balance || 0).toLocaleString("en-IN");
        }

      }

    } catch (err) {
      console.error("Dashboard Error:", err);
    }

  }

});
// ================= LOGOUT =================

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      logoutBtn.disabled = true;
      logoutBtn.innerHTML = "Signing Out...";

      await signOut(auth);

      window.location.href = "login.html";

    } catch (error) {

      alert(error.message);

      logoutBtn.disabled = false;
      logoutBtn.innerHTML = "Logout";

    }

  });

}

// ================= SESSION CHECK =================

onAuthStateChanged(auth, (user) => {

  const page = window.location.pathname;

  // Login/Register page te already login hai
  if (
    user &&
    (page.includes("login.html") || page.includes("register.html"))
  ) {
    window.location.href = "dashboard.html";
  }

});

// ================= APP READY =================

window.addEventListener("DOMContentLoaded", () => {

  console.log("✅ GrowVest Ready");

  document.body.classList.add("loaded");

});
// ================= SAFE HELPERS =================

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatCurrency(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

// ================= LOAD USER INFO =================

async function loadUserData(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const data = userSnap.data();

    setText("userName", data.name || user.email);
    setText("userEmail", data.email || user.email);
    setText("balance", formatCurrency(data.balance));

  } catch (err) {
    console.error("Load User Error:", err);
  }
}

// ================= APP START =================

window.addEventListener("load", async () => {

  const user = auth.currentUser;

  if (user) {
    await loadUserData(user);
  }

  console.log("🚀 GrowVest App Loaded");

});
