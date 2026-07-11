import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const withdrawBtn = document.getElementById("withdrawBtn");
const amountInput = document.getElementById("amount");
const walletInput = document.getElementById("wallet");

onAuthStateChanged(auth, (user) => {

  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  withdrawBtn.addEventListener("click", async () => {

    const amount = Number(amountInput.value);
    const wallet = walletInput.value.trim();

    if (amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    if (wallet === "") {
      alert("Enter your USDT wallet address.");
      return;
    }

    try {

      await addDoc(collection(db, "withdrawals"), {
        uid: user.uid,
        email: user.email,
        amount: amount,
        wallet: wallet,
        status: "Pending",
        createdAt: serverTimestamp()
      });

      alert("Withdrawal request submitted successfully!");

      amountInput.value = "";
      walletInput.value = "";

    } catch (error) {
      alert("Firebase Error: " + error.message);
    }

  });

});