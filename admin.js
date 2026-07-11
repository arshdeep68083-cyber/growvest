import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const pendingDeposits = document.getElementById("pendingDeposits");
const approvedDeposits = document.getElementById("approvedDeposits");
const pendingWithdrawals = document.getElementById("pendingWithdrawals");
const approvedWithdrawals = document.getElementById("approvedWithdrawals");

async function loadDeposits() {

  pendingDeposits.innerHTML = "";
  approvedDeposits.innerHTML = "";

  const snapshot = await getDocs(collection(db, "deposits"));

  if (snapshot.empty) {
    pendingDeposits.innerHTML = "<p>No pending deposits.</p>";
    approvedDeposits.innerHTML = "<p>No approved deposits.</p>";
    return;
  }

  snapshot.forEach((depositDoc) => {

    const data = depositDoc.data();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <p><b>${data.email}</b></p>
      <p>Amount: ${data.amount} USDT</p>
      <p>TXID: ${data.txid}</p>
      <p>Status: ${data.status}</p>
    `;

    if (data.status === "Pending") {

      const approveBtn = document.createElement("button");
      approveBtn.textContent = "Approve";

      approveBtn.onclick = async () => {

        const userRef = doc(db, "users", data.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

          const balance = Number(userSnap.data().balance || 0);

          await updateDoc(userRef, {
            balance: balance + Number(data.amount)
          });

        }

        await updateDoc(doc(db, "deposits", depositDoc.id), {
          status: "Approved"
        });

        loadDeposits();
        loadWithdrawals();
      };

      const rejectBtn = document.createElement("button");
      rejectBtn.textContent = "Reject";
      rejectBtn.style.marginLeft = "10px";

      rejectBtn.onclick = async () => {

        await updateDoc(doc(db, "deposits", depositDoc.id), {
          status: "Rejected"
        });

        loadDeposits();
      };

      card.appendChild(approveBtn);
      card.appendChild(rejectBtn);

      pendingDeposits.appendChild(card);

    } else {

      approvedDeposits.appendChild(card);

    }

  });

} 
import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// baaki code...
import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const pendingContainer = document.getElementById("pendingDeposits");
const approvedContainer = document.getElementById("approvedDeposits");

async function loadDeposits() {

  pendingContainer.innerHTML = "";
  approvedContainer.innerHTML = "";

  const snapshot = await getDocs(collection(db, "deposits"));

  snapshot.forEach((depositDoc) => {

    const data = depositDoc.data();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <p><b>${data.email}</b></p>
      <p>Amount: ${data.amount} USDT</p>
      <p>TXID: ${data.txid}</p>
      <p>Status: ${data.status}</p>
    `;

    if (data.status === "Pending") {

      const approveBtn = document.createElement("button");
      approveBtn.textContent = "Approve";
      approveBtn.onclick = async () => {

        await updateDoc(doc(db, "deposits", depositDoc.id), {
          status: "Approved"
        });

        loadDeposits();
      };

      card.appendChild(approveBtn);
            const rejectBtn = document.createElement("button");
      rejectBtn.textContent = "Reject";
      rejectBtn.style.marginLeft = "10px";

      rejectBtn.onclick = async () => {
        await updateDoc(doc(db, "deposits", depositDoc.id), {
          status: "Rejected"
        });

        loadDeposits();
      };

      card.appendChild(rejectBtn);
      card.appendChild(rejectBtn);

      pendingContainer.appendChild(card);

    } else {

      approvedContainer.appendChild(card);

    }

  });

}

loadDeposits();
