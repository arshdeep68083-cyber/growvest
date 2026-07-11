import { auth, db } from "./firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const amountInput = document.getElementById("withdrawAmount");
const walletInput = document.getElementById("walletAddress");
const withdrawBtn = document.getElementById("submitWithdraw");
const status = document.getElementById("withdrawStatus");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
});

withdrawBtn.addEventListener("click", async () => {

  if (!currentUser) {
    alert("Please wait...");
    return;
  }

  const amount = Number(amountInput.value);
  const wallet = walletInput.value.trim();

  if (isNaN(amount) || amount < 10) {
    alert("Minimum withdrawal is 10 USDT");
    return;
  }

  if (wallet === "") {
    alert("Please enter your TRC20 wallet address.");
    return;
  }

  try {

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found.");
      return;
    }

    let balance = Number(userSnap.data().balance || 0);

    if (balance < amount) {
      alert("❌ Insufficient Balance");
      return;
    }

    // Deduct Balance
    balance -= amount;

    await updateDoc(userRef, {
      balance: balance
    });

    // Save Withdrawal Request
    await addDoc(collection(db, "withdrawals"), {
      uid: currentUser.uid,
      email: currentUser.email,
      amount: amount,
      wallet: wallet,
      currency: "USDT",
      status: "Pending",
      createdAt: serverTimestamp()
    });

    // Save History
    await addDoc(collection(db, "history"), {
      uid: currentUser.uid,
      email: currentUser.email,
      type: "Withdrawal",
      amount: amount,
      currency: "USDT",
      description: "Withdrawal Request",
      status: "Pending",
      createdAt: serverTimestamp()
    });

    status.textContent = "✅ Withdrawal request submitted. Waiting for admin approval.";

    alert("✅ Withdrawal Request Submitted Successfully!");

    amountInput.value = "";
    walletInput.value = "";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }

});
