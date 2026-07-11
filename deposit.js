import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const amountInput = document.getElementById("amount");
const depositBtn = document.getElementById("depositBtn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
});

depositBtn.addEventListener("click", async () => {

  if (!currentUser) {
    alert("User not logged in.");
    return;
  }

  const amount = Number(amountInput.value);

  if (amount <= 0 || isNaN(amount)) {
    alert("Enter a valid amount.");
    return;
  }

  depositBtn.disabled = true;
  depositBtn.textContent = "Submitting...";

  try {

    await addDoc(collection(db, "deposits"), {
      uid: currentUser.uid,
      email: currentUser.email,
      amount: amount,
      wallet: "TRCaFDAORMmKvQPSDsJ1JdqhoQgioRhSXF",
      status: "Pending",
      createdAt: serverTimestamp()
    });

    alert("Deposit request submitted successfully.");

    amountInput.value = "";

  } catch (error) {

    console.error(error);
    alert("Error: " + error.message);

  } finally {

    depositBtn.disabled = false;
    depositBtn.textContent = "Submit Deposit";

  }

});