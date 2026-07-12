import { auth, db, storage } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const amountInput = document.getElementById("amount");
const proofInput = document.getElementById("paymentProof");
const depositBtn = document.getElementById("depositBtn");

let currentUser = null;

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

});

depositBtn.addEventListener("click", async () => {

  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  const amount = Number(amountInput.value);
  const proof = proofInput.files[0];

  if (!amount || amount <= 0) {
    alert("Please enter a valid deposit amount.");
    return;
  }

  if (!proof) {
    alert("Please upload payment screenshot.");
    return;
  }

  depositBtn.disabled = true;
  depositBtn.textContent = "Uploading...";
    try {

    // Upload screenshot to Firebase Storage
    const fileName =
      `depositProofs/${currentUser.uid}_${Date.now()}_${proof.name}`;

    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, proof);

    const proofURL = await getDownloadURL(storageRef);

    // Save deposit request
    await addDoc(collection(db, "deposits"), {
      uid: currentUser.uid,
      email: currentUser.email,
      amount: amount,
      wallet: "TRCaFDAORMmKvQPSDsJ1JdqhoQgioRhSXF",
      proofURL: proofURL,
      status: "Pending",
      createdAt: serverTimestamp()
    });

    alert("✅ Deposit request submitted successfully!");

    amountInput.value = "";
    proofInput.value = "";

  } catch (error) {

    console.error(error);
    alert("❌ " + error.message);

  } finally {

    depositBtn.disabled = false;
    depositBtn.innerHTML = `
      <i class="fas fa-paper-plane"></i>
      Submit Deposit
    `;

  }

});
