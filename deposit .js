import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

alert("deposit.js loaded");

const amount = document.getElementById("amount");
const depositBtn = document.getElementById("depositBtn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {

  if (!user) {
    alert("Please Login First");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

});

depositBtn.addEventListener("click", async () => {

  if (!currentUser) {
    alert("Please Wait...");
    return;
  }

  const depositAmount = Number(amount.value);

  if (depositAmount <= 0 || isNaN(depositAmount)) {
    alert("Enter Valid Amount");
    return;
  }

  try {

    await addDoc(collection(db, "deposits"), {
      uid: currentUser.uid,
      email: currentUser.email,
      amount: depositAmount,
      status: "Pending",
      wallet: "TRCaFDAORMmKvQPSDsJ1JdqhoQgioRhSXF",
      createdAt: serverTimestamp()
    });

    alert("Deposit Request Submitted Successfully!");

    amount.value = "";

  } catch (error) {

    alert("Firebase Error : " + error.message);

  }

});