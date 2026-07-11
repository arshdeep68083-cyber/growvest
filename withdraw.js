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

const amountInput = document.getElementById("amount");
const walletInput = document.getElementById("wallet");
const withdrawBtn = document.getElementById("withdrawBtn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
});

withdrawBtn.onclick = async () => {

  if (!currentUser) {
    alert("Please wait...");
    return;
  }

  const amount = Number(amountInput.value);
  const wallet = walletInput.value.trim();

  if (amount < 100 || isNaN(amount)) {
    alert("Minimum withdrawal is 100 USDT");
    return;
  }

  if (wallet === "") {
    alert("Enter TRC20 Wallet Address");
    return;
  }

  try {

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User not found");
      return;
    }

    let balance = Number(userSnap.data().balance || 0);

    if (balance < amount) {
      alert("Insufficient Balance");
      return;
    }

    balance -= amount;

    await updateDoc(userRef, {
      balance: balance
    });

    await addDoc(collection(db, "withdrawals"), {
      uid: currentUser.uid,
      email: currentUser.email,
      amount: amount,
      wallet: wallet,
      currency: "USDT",
      status: "Pending",
      createdAt: serverTimestamp()
    });

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

    alert("Withdrawal Request Submitted Successfully!");

    amountInput.value = "";
    walletInput.value = "";

    window.location.href = "dashboard.html";

  } catch (error) {
    console.error(error);
    alert("Error: " + error.message);
  }

};