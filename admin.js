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
