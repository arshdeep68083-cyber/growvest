import { db, auth } from "./firebase-config.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const walletInput = document.getElementById("walletAddress");
const copyBtn = document.getElementById("copyBtn");
const submitBtn = document.getElementById("submitDeposit");
const amountInput = document.getElementById("depositAmount");
const txidInput = document.getElementById("txid");
const status = document.getElementById("depositStatus");

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(walletInput.value);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy Address";
    }, 2000);
  } catch (e) {
    alert("Copy failed. Please copy manually.");
  }
});

submitBtn.addEventListener("click", async () => {

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  const amount = amountInput.value.trim();
  const txid = txidInput.value.trim();

  if (!amount || !txid) {
    alert("Enter amount and TXID.");
    return;
  }
    try {

    await setDoc(doc(db, "deposits", user.uid + "_" + Date.now()), {
      uid: user.uid,
      email: user.email,
      amount: Number(amount),
      txid: txid,
      wallet: walletInput.value,
      network: "TRC20",
      status: "Pending",
      createdAt: serverTimestamp()
    });

    status.textContent = "✅ Deposit request submitted. Waiting for admin approval.";

    amountInput.value = "";
    txidInput.value = "";

  } catch (error) {
    console.error(error);
    alert("Failed to submit deposit request.");
  }

});
