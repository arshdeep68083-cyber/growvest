import { auth, db } from "./firebase-config.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userBalance = document.getElementById("userBalance");
const userInvestment = document.getElementById("userInvestment");
const userId = document.getElementById("userId");
const joinDate = document.getElementById("joinDate");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userEmail.textContent = user.email;
  userId.textContent = user.uid;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();

    userName.textContent = data.name || "GrowVest User";
    userBalance.textContent = `${data.balance || 0} USDT`;
    userInvestment.textContent = `${data.investment || 0} USDT`;

    if (data.createdAt?.toDate) {
      joinDate.textContent = data.createdAt.toDate().toLocaleDateString();
    } else {
      joinDate.textContent = "N/A";
    }
  }
    else {
    userName.textContent = "GrowVest User";
    userBalance.textContent = "0.00 USDT";
    userInvestment.textContent = "0.00 USDT";
    joinDate.textContent = "N/A";
  }

});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error(error);
    alert("Logout failed.");
  }
});
